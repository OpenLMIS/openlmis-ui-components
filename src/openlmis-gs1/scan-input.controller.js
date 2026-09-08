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
     * @ngdoc controller
     * @name openlmis-gs1.controller:ScanInputController
     *
     * @description
     * Drives the scan input component: subscribes to keystroke capture, parses what it captures and
     * reports the outcome as a transient status and to the screen's handler.
     */
    angular
        .module('openlmis-gs1')
        .controller('ScanInputController', ScanInputController);

    ScanInputController.$inject = [
        '$scope',
        '$timeout',
        'gs1ScanCaptureService',
        'gs1BarcodeParserService',
        'GS1_SCAN_MODE',
        'GS1_SCAN_STATUS',
        'GS1_PARSE_ERROR',
        'GS1_CAPTURE_CONFIG'
    ];

    function ScanInputController($scope, $timeout, gs1ScanCaptureService, gs1BarcodeParserService,
                                 GS1_SCAN_MODE, GS1_SCAN_STATUS, GS1_PARSE_ERROR,
                                 GS1_CAPTURE_CONFIG) {

        /**
         * Failures are grouped, because what a user can do about a scan falls into fewer cases than
         * the parser distinguishes. The scanner configuration case is kept separate on purpose - it
         * turns a mystifying failure into a fixable one.
         */
        var ERROR_MESSAGES = {},
            vm = this,
            unsubscribe,
            resetPromise,
            scanSequence = 0;

        ERROR_MESSAGES[GS1_PARSE_ERROR.VALUE_TOO_LONG] = 'openlmisGs1.scanErrorScannerSetup';
        ERROR_MESSAGES[GS1_PARSE_ERROR.INVALID_LOT_CODE] = 'openlmisGs1.scanErrorScannerSetup';
        ERROR_MESSAGES[GS1_PARSE_ERROR.INVALID_SERIAL] = 'openlmisGs1.scanErrorScannerSetup';
        ERROR_MESSAGES[GS1_PARSE_ERROR.MISSING_GTIN] = 'openlmisGs1.scanErrorNoProductCode';
        ERROR_MESSAGES[GS1_PARSE_ERROR.INVALID_GTIN] = 'openlmisGs1.scanErrorProductCode';
        ERROR_MESSAGES[GS1_PARSE_ERROR.INVALID_GTIN_CHECK_DIGIT] = 'openlmisGs1.scanErrorProductCode';
        ERROR_MESSAGES[GS1_PARSE_ERROR.INVALID_EXPIRATION_DATE] = 'openlmisGs1.scanErrorExpiry';
        ERROR_MESSAGES[GS1_PARSE_ERROR.TRUNCATED_ELEMENT_STRING] = 'openlmisGs1.scanErrorIncomplete';
        ERROR_MESSAGES[GS1_PARSE_ERROR.MISSING_SYMBOLOGY_IDENTIFIER] =
            'openlmisGs1.scanErrorScannerSetup';

        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.statusMessage = statusMessage;
        vm.statusMessageParams = statusMessageParams;

        /**
         * @ngdoc method
         * @methodOf openlmis-gs1.controller:ScanInputController
         * @name $onInit
         *
         * @description
         * Validates the bindings and starts listening. A bad mode or a missing handler throws rather
         * than silently doing nothing, which is far more expensive to diagnose - an absent handler
         * would otherwise report every scan as accepted while nothing at all happened.
         */
        function onInit() {
            if (validModes().indexOf(vm.mode) === -1) {
                unavailable('openlmisScanInput requires one of the GS1_SCAN_MODE values, got: '
                    + vm.mode);
                return;
            }

            if (!angular.isFunction(vm.onScan)) {
                unavailable('openlmisScanInput requires an on-scan handler');
                return;
            }

            vm.status = GS1_SCAN_STATUS.READY;
            unsubscribe = gs1ScanCaptureService.subscribe(onPayload);
        }

        function unavailable(message) {
            setStatus(GS1_SCAN_STATUS.ERROR, undefined, {
                key: 'openlmisGs1.scanUnavailable'
            });
            throw new Error(message);
        }

        function onDestroy() {
            if (unsubscribe) {
                unsubscribe();
            }

            if (resetPromise) {
                $timeout.cancel(resetPromise);
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-gs1.controller:ScanInputController
         * @name statusMessage
         *
         * @description
         * The message key describing the current state, for the template to translate.
         *
         * @return {String} a message key
         */
        function statusMessage() {
            if (vm.status === GS1_SCAN_STATUS.SUCCESS) {
                return 'openlmisGs1.scanAccepted';
            }

            if (vm.status === GS1_SCAN_STATUS.WORKING) {
                return 'openlmisGs1.scanWorking';
            }

            if (vm.status === GS1_SCAN_STATUS.ERROR) {
                return vm.errorMessageKey
                    || ERROR_MESSAGES[vm.errorCode]
                    || 'openlmisGs1.scanErrorNotRecognized';
            }

            return 'openlmisGs1.scannerReady';
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-gs1.controller:ScanInputController
         * @name statusMessageParams
         *
         * @description
         * Values the current message names, such as the product or batch code that failed to match.
         *
         * @return {Object} parameters for the message, undefined when it takes none
         */
        function statusMessageParams() {
            return vm.status === GS1_SCAN_STATUS.ERROR ? vm.errorMessageParams : undefined;
        }

        /**
         * Runs outside Angular, so it enters a digest itself. $applyAsync, not $apply: $apply throws
         * if a digest is already running, and Angular routes that throw to $exceptionHandler - so
         * the scan would be dropped with no visible error.
         */
        function onPayload(payload) {
            var scan = gs1BarcodeParserService.parse(payload);

            $scope.$applyAsync(function() {
                /*
                 * Taken for every scan, parseable or not. A scan that cannot be read still supersedes
                 * the one before it, so an outcome still in flight from that one cannot come back and
                 * report success over this failure.
                 */
                var token = nextToken();

                if (scan.error) {
                    setTransientStatus(GS1_SCAN_STATUS.ERROR, scan.error, undefined);
                    return;
                }

                report(scan, token);
            });
        }

        /**
         * A handler may return a promise - resolving a scanned code against the backend takes a round
         * trip - and until it settles the scan is only captured, not accepted. A handler returning
         * anything else is taken at face value and reported as accepted straight away.
         */
        function report(scan, token) {
            var outcome = vm.onScan({
                scan: scan,
                mode: vm.mode,
                context: vm.context
            });

            if (!outcome || !angular.isFunction(outcome.then)) {
                setTransientStatus(GS1_SCAN_STATUS.SUCCESS, undefined, undefined);
                return;
            }

            setStatus(GS1_SCAN_STATUS.WORKING, undefined, undefined);

            outcome.then(function() {
                applyOutcome(token, GS1_SCAN_STATUS.SUCCESS, undefined);
            }, function(rejection) {
                applyOutcome(token, GS1_SCAN_STATUS.ERROR, messageOf(rejection));
            });
        }

        /**
         * Scans can arrive faster than a handler settles, so an outcome is dropped unless it belongs
         * to the most recent scan. Otherwise a slow early lookup would overwrite a later result.
         */
        function applyOutcome(token, status, message) {
            if (token !== scanSequence) {
                return;
            }

            setTransientStatus(status, undefined, message);
        }

        /**
         * A handler may refuse with a message key, or with `{messageKey, messageParams}` when the
         * wording names what failed to match - the scanned product or batch code, which is what a clerk
         * needs in order to act on the refusal.
         */
        function messageOf(rejection) {
            if (angular.isString(rejection) && rejection.length) {
                return {
                    key: rejection
                };
            }

            if (rejection && angular.isString(rejection.messageKey)) {
                return {
                    key: rejection.messageKey,
                    params: rejection.messageParams
                };
            }

            return {
                key: 'openlmisGs1.scanNotResolved'
            };
        }

        function nextToken() {
            scanSequence = scanSequence + 1;

            return scanSequence;
        }

        function setStatus(status, errorCode, message) {
            vm.status = status;
            vm.errorCode = errorCode;
            vm.errorMessageKey = message && message.key;
            vm.errorMessageParams = message && message.params;

            if (resetPromise) {
                $timeout.cancel(resetPromise);
                resetPromise = undefined;
            }
        }

        function setTransientStatus(status, errorCode, message) {
            setStatus(status, errorCode, message);

            resetPromise = $timeout(function() {
                setStatus(GS1_SCAN_STATUS.READY, undefined, undefined);
            }, GS1_CAPTURE_CONFIG.statusResetDelay);
        }

        function validModes() {
            return Object.keys(GS1_SCAN_MODE)
                .map(function(key) {
                    return GS1_SCAN_MODE[key];
                });
        }
    }

})();
