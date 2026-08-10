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

describe('ScanInputController', function() {

    var PAYLOAD = ']d20105890123456786';

    beforeEach(function() {
        var $controller, $rootScope, $timeout, captureService, parserService, mode, status,
            parseError, captureConfig, q;

        module('openlmis-gs1');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $timeout = $injector.get('$timeout');
            captureService = $injector.get('gs1ScanCaptureService');
            parserService = $injector.get('gs1BarcodeParserService');
            mode = $injector.get('GS1_SCAN_MODE');
            status = $injector.get('GS1_SCAN_STATUS');
            parseError = $injector.get('GS1_PARSE_ERROR');
            captureConfig = $injector.get('GS1_CAPTURE_CONFIG');
            q = $injector.get('$q');
        });

        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.$q = q;
        this.MODE = mode;
        this.STATUS = status;
        this.ERROR = parseError;
        this.config = captureConfig;
        this.parserService = parserService;

        this.unsubscribe = jasmine.createSpy('unsubscribe');
        this.captured = undefined;
        spyOn(captureService, 'subscribe').andCallFake(function(onPayload) {
            this.captured = onPayload;
            return this.unsubscribe;
        }.bind(this));

        this.onScan = jasmine.createSpy('onScan');
        this.scope = $rootScope.$new();

        /**
         * The controller reports through $applyAsync, so a digest must run before the result shows.
         */
        this.capture = function(payload) {
            this.captured(payload);
            this.$rootScope.$digest();
        };

        this.build = function(bindings) {
            var vm = $controller('ScanInputController', {
                $scope: this.scope
            });

            angular.extend(vm, {
                mode: this.MODE.RECEIVE,
                context: {
                    rows: []
                },
                onScan: this.onScan
            }, bindings);

            vm.$onInit();

            return vm;
        };
    });

    describe('$onInit', function() {

        it('should start listening for scanner input', function() {
            var vm = this.build();

            expect(vm.status).toEqual(this.STATUS.READY);
            expect(angular.isFunction(this.captured)).toBe(true);
        });

        it('should throw when the mode is not recognised', function() {
            var context = this;

            expect(function() {
                context.build({
                    mode: 'NOT_A_MODE'
                });
            }).toThrow();
        });

        it('should throw when no mode was given', function() {
            var context = this;

            expect(function() {
                context.build({
                    mode: undefined
                });
            }).toThrow();
        });
    });

    describe('on a captured scan', function() {

        it('should report the parsed scan, mode and context to the handler', function() {
            var vm = this.build();

            this.capture(PAYLOAD);

            expect(this.onScan).toHaveBeenCalled();
            expect(this.onScan.calls[0].args[0].mode).toEqual(this.MODE.RECEIVE);
            expect(this.onScan.calls[0].args[0].context).toBe(vm.context);
            expect(this.onScan.calls[0].args[0].scan.gtin).toEqual('05890123456786');
        });

        it('should pass a mode other than receive through unchanged', function() {
            this.build({
                mode: this.MODE.ADJUSTMENT
            });

            this.capture(PAYLOAD);

            expect(this.onScan).toHaveBeenCalled();
            expect(this.onScan.calls[0].args[0].mode).toEqual(this.MODE.ADJUSTMENT);
        });

        it('should show a success status', function() {
            var vm = this.build();

            this.capture(PAYLOAD);

            expect(vm.status).toEqual(this.STATUS.SUCCESS);
            expect(vm.statusMessage()).toEqual('openlmisGs1.scanAccepted');
        });

        it('should fall back to ready after the status delay', function() {
            var vm = this.build();

            this.capture(PAYLOAD);
            this.$timeout.flush(this.config.statusResetDelay);

            expect(vm.status).toEqual(this.STATUS.READY);
            expect(vm.statusMessage()).toEqual('openlmisGs1.scannerReady');
        });
    });

    describe('on an unparseable scan', function() {

        it('should not call the handler', function() {
            this.build();

            this.capture('HELLO WORLD');

            expect(this.onScan).not.toHaveBeenCalled();
        });

        it('should show an error status', function() {
            var vm = this.build();

            this.capture('HELLO WORLD');

            expect(vm.status).toEqual(this.STATUS.ERROR);
            expect(vm.errorCode).toEqual(this.ERROR.MALFORMED_ELEMENT_STRING);
        });

        it('should point at the scanner configuration when a value overran', function() {
            var vm = this.build();

            spyOn(this.parserService, 'parse').andReturn({
                error: this.ERROR.VALUE_TOO_LONG
            });

            this.capture(PAYLOAD);

            expect(vm.statusMessage()).toEqual('openlmisGs1.scanErrorScannerSetup');
        });

        it('should point at the scanner configuration on an invalid lot code', function() {
            var vm = this.build();

            spyOn(this.parserService, 'parse').andReturn({
                error: this.ERROR.INVALID_LOT_CODE
            });

            this.capture(PAYLOAD);

            expect(vm.statusMessage()).toEqual('openlmisGs1.scanErrorScannerSetup');
        });

        it('should report a missing product code distinctly', function() {
            var vm = this.build();

            spyOn(this.parserService, 'parse').andReturn({
                error: this.ERROR.MISSING_GTIN
            });

            this.capture(PAYLOAD);

            expect(vm.statusMessage()).toEqual('openlmisGs1.scanErrorNoProductCode');
        });

        it('should fall back to a generic message for an unmapped code', function() {
            var vm = this.build();

            spyOn(this.parserService, 'parse').andReturn({
                error: this.ERROR.NO_APPLICATION_IDENTIFIERS
            });

            this.capture(PAYLOAD);

            expect(vm.statusMessage()).toEqual('openlmisGs1.scanErrorNotRecognized');
        });
    });

    describe('when the handler returns a promise', function() {

        it('should report working until the handler settles', function() {
            var deferred = this.$q.defer(),
                vm = this.build();

            this.onScan.andReturn(deferred.promise);
            this.capture(PAYLOAD);

            expect(vm.status).toEqual(this.STATUS.WORKING);
            expect(vm.statusMessage()).toEqual('openlmisGs1.scanWorking');
        });

        it('should report success once the handler resolves', function() {
            var deferred = this.$q.defer(),
                vm = this.build();

            this.onScan.andReturn(deferred.promise);
            this.capture(PAYLOAD);
            deferred.resolve();
            this.$rootScope.$digest();

            expect(vm.status).toEqual(this.STATUS.SUCCESS);
        });

        it('should report an error once the handler rejects', function() {
            var deferred = this.$q.defer(),
                vm = this.build();

            this.onScan.andReturn(deferred.promise);
            this.capture(PAYLOAD);
            deferred.reject();
            this.$rootScope.$digest();

            expect(vm.status).toEqual(this.STATUS.ERROR);
            expect(vm.statusMessage()).toEqual('openlmisGs1.scanNotResolved');
        });

        it('should show a message key the handler rejected with', function() {
            var deferred = this.$q.defer(),
                vm = this.build();

            this.onScan.andReturn(deferred.promise);
            this.capture(PAYLOAD);
            deferred.reject('stockIssueCreation.scanGtinNotFound');
            this.$rootScope.$digest();

            expect(vm.statusMessage()).toEqual('stockIssueCreation.scanGtinNotFound');
        });

        it('should ignore the outcome of a scan that a later one superseded', function() {
            var first = this.$q.defer(),
                second = this.$q.defer(),
                vm = this.build();

            this.onScan.andReturn(first.promise);
            this.capture(PAYLOAD);

            this.onScan.andReturn(second.promise);
            this.capture(PAYLOAD);

            second.resolve();
            first.reject('stockIssueCreation.scanGtinNotFound');
            this.$rootScope.$digest();

            expect(vm.status).toEqual(this.STATUS.SUCCESS);
        });

        it('should fall back to ready after the status delay', function() {
            var deferred = this.$q.defer(),
                vm = this.build();

            this.onScan.andReturn(deferred.promise);
            this.capture(PAYLOAD);
            deferred.resolve();
            this.$rootScope.$digest();
            this.$timeout.flush(this.config.statusResetDelay);

            expect(vm.status).toEqual(this.STATUS.READY);
        });
    });

    describe('$onDestroy', function() {

        it('should stop listening', function() {
            var vm = this.build();

            vm.$onDestroy();

            expect(this.unsubscribe).toHaveBeenCalled();
        });

        it('should cancel a pending status reset', function() {
            var vm = this.build();

            this.capture(PAYLOAD);
            vm.$onDestroy();

            expect(this.$timeout.verifyNoPendingTasks).not.toThrow();
        });
    });

});
