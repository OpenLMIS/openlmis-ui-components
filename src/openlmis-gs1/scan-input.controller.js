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

        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.statusMessage = statusMessage;

        /**
         * @ngdoc method
         * @methodOf openlmis-gs1.controller:ScanInputController
         * @name $onInit
         *
         * @description
         * Validates the mode and starts listening. An unrecognised mode throws rather than silently
         * doing nothing, which is far more expensive to diagnose.
         */
        function onInit() {
            if (validModes().indexOf(vm.mode) === -1) {
                throw new Error('openlmisScanInput requires one of the GS1_SCAN_MODE values, got: '
                    + vm.mode);
            }

            vm.status = GS1_SCAN_STATUS.READY;
            unsubscribe = gs1ScanCaptureService.subscribe(onPayload);
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
         * Runs outside Angular, so it enters a digest itself. $applyAsync, not $apply: $apply throws
         * if a digest is already running, and Angular routes that throw to $exceptionHandler - so
         * the scan would be dropped with no visible error.
         */
        function onPayload(payload) {
            var scan = gs1BarcodeParserService.parse(payload);

            $scope.$applyAsync(function() {
                if (scan.error) {
                    setTransientStatus(GS1_SCAN_STATUS.ERROR, scan.error, undefined);
                    return;
                }

                report(scan);
            });
        }

        /**
         * A handler may return a promise - resolving a scanned code against the backend takes a round
         * trip - and until it settles the scan is only captured, not accepted. A handler returning
         * anything else is taken at face value and reported as accepted straight away.
         */
        function report(scan) {
            var token = nextToken(),
                outcome = vm.onScan({
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
                applyOutcome(token, GS1_SCAN_STATUS.ERROR, messageKeyOf(rejection));
            });
        }

        /**
         * Scans can arrive faster than a handler settles, so an outcome is dropped unless it belongs
         * to the most recent scan. Otherwise a slow early lookup would overwrite a later result.
         */
        function applyOutcome(token, status, messageKey) {
            if (token !== scanSequence) {
                return;
            }

            setTransientStatus(status, undefined, messageKey);
        }

        function messageKeyOf(rejection) {
            if (angular.isString(rejection) && rejection.length) {
                return rejection;
            }

            return 'openlmisGs1.scanNotResolved';
        }

        function nextToken() {
            scanSequence = scanSequence + 1;

            return scanSequence;
        }

        function setStatus(status, errorCode, messageKey) {
            vm.status = status;
            vm.errorCode = errorCode;
            vm.errorMessageKey = messageKey;

            if (resetPromise) {
                $timeout.cancel(resetPromise);
                resetPromise = undefined;
            }
        }

        function setTransientStatus(status, errorCode, messageKey) {
            setStatus(status, errorCode, messageKey);

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
