/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-gs1.gs1ScanCaptureService
     *
     * @description
     * Recognises scanner input among ordinary keyboard events and hands the payload to a subscriber.
     *
     * A wedge scanner is indistinguishable from a keyboard except by timing, which forces three
     * properties here:
     *
     * - Listens on the document in the capture phase and buffers from the first keystroke, so no
     *   character is lost whatever has focus.
     * - Cannot suppress the opening characters of a burst - there is no interval to measure yet - so
     *   it restores the focused field to its snapshotted value instead.
     * - Always suppresses the terminator of a confirmed scan; an unsuppressed Enter would submit
     *   whatever form owns the focused field.
     *
     */
    angular
        .module('openlmis-gs1')
        .service('gs1ScanCaptureService', gs1ScanCaptureService);

    gs1ScanCaptureService.$inject = [
        '$document',
        '$window',
        'GS1_CAPTURE_CONFIG',
        'GS1_PARSE_CONFIG'
    ];

    function gs1ScanCaptureService($document, $window, GS1_CAPTURE_CONFIG, GS1_PARSE_CONFIG) {

        var GROUP_SEPARATOR_KEY_CODE = 29;

        this.subscribe = subscribe;

        /**
         * @ngdoc method
         * @methodOf openlmis-gs1.gs1ScanCaptureService
         * @name subscribe
         *
         * @description
         * Starts listening for scanner input. The subscriber is called with the raw payload outside
         * of a digest, so a caller updating the view must enter one itself.
         *
         * @param  {Function} onPayload called with the raw payload string of each confirmed scan
         * @return {Function}           call to stop listening; safe to call more than once
         */
        function subscribe(onPayload) {
            var state = createState(),
                document = $document[0],
                listener = function(event) {
                    handleKeydown(event, state, onPayload);
                };

            document.addEventListener('keydown', listener, true);

            return function() {
                document.removeEventListener('keydown', listener, true);
            };
        }

        function createState() {
            return {
                characters: [],
                lastKeyTime: 0,
                suppressing: false,
                snapshot: undefined
            };
        }

        function handleKeydown(event, state, onPayload) {
            if (isIgnorable(event)) {
                return;
            }

            if (isTerminator(event)) {
                finishBurst(event, state, onPayload);
                return;
            }

            collectCharacter(event, state);
        }

        /**
         * Modified keystrokes are shortcuts and auto repeat is a held key; a scanner sends neither.
         */
        function isIgnorable(event) {
            return Boolean(event.ctrlKey || event.altKey || event.metaKey || event.repeat);
        }

        function isTerminator(event) {
            return GS1_CAPTURE_CONFIG.terminators.indexOf(event.key) !== -1;
        }

        function collectCharacter(event, state) {
            var character = readCharacter(event),
                now = $window.Date.now();

            if (character === undefined) {
                return;
            }

            if (now - state.lastKeyTime > GS1_CAPTURE_CONFIG.burstThreshold) {
                restartBurst(state, event);
            }

            state.lastKeyTime = now;
            state.characters.push(character);

            if (state.characters.length >= GS1_CAPTURE_CONFIG.suppressAfter) {
                state.suppressing = true;
            }

            if (state.suppressing) {
                event.preventDefault();
            }
        }

        /**
         * The group separator has no printable form, so browsers report it inconsistently. Printable
         * substitutes are configured on GS1_PARSE_CONFIG, where the parser rewrites them.
         */
        function readCharacter(event) {
            if (event.key && event.key.length === 1) {
                return event.key;
            }

            if (event.keyCode === GROUP_SEPARATOR_KEY_CODE) {
                return GS1_PARSE_CONFIG.groupSeparator;
            }

            return undefined;
        }

        function restartBurst(state, event) {
            state.characters = [];
            state.suppressing = false;
            state.snapshot = takeSnapshot(event.target);
        }

        function finishBurst(event, state, onPayload) {
            var payload = state.characters.join('');

            if (state.characters.length < GS1_CAPTURE_CONFIG.minPayloadLength) {
                resetBurst(state);
                return;
            }

            event.preventDefault();
            restoreSnapshot(state.snapshot);
            resetBurst(state);
            onPayload(payload);
        }

        function resetBurst(state) {
            state.characters = [];
            state.suppressing = false;
            state.snapshot = undefined;
            state.lastKeyTime = 0;
        }

        /**
         * Value only, not the selection: reading selectionStart throws on number inputs, which is
         * exactly where a stray scan tends to land.
         */
        function takeSnapshot(element) {
            if (!isRestorable(element)) {
                return undefined;
            }

            return {
                element: element,
                value: element.value
            };
        }

        function isRestorable(element) {
            if (!GS1_CAPTURE_CONFIG.restoreLeakedInput || !element) {
                return false;
            }

            return typeof element.value === 'string';
        }

        /**
         * The input event is what lets ng-model see the restore; assigning the value alone would
         * leave the model holding the leaked characters.
         */
        function restoreSnapshot(snapshot) {
            if (!snapshot || snapshot.element.value === snapshot.value) {
                return;
            }

            snapshot.element.value = snapshot.value;
            snapshot.element.dispatchEvent(new $window.Event('input', {
                bubbles: true
            }));
        }
    }

})();
