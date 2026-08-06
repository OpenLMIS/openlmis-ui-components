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

describe('openlmis-scan-input component', function() {

    var PAYLOAD = ']d20105890123456786';

    beforeEach(function() {
        var $compile, $rootScope, captureService;

        module('openlmis-gs1');

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            captureService = $injector.get('gs1ScanCaptureService');
        });

        this.$compile = $compile;
        this.$rootScope = $rootScope;
        this.$scope = $rootScope.$new();

        this.unsubscribe = jasmine.createSpy('unsubscribe');
        this.captured = undefined;
        spyOn(captureService, 'subscribe').andCallFake(function(onPayload) {
            this.captured = onPayload;
            return this.unsubscribe;
        }.bind(this));

        this.$scope.onScan = jasmine.createSpy('onScan');
        this.$scope.scanContext = {
            rows: []
        };

        this.markup = '<openlmis-scan-input mode="RECEIVE" context="scanContext"'
            + ' on-scan="onScan(scan, mode, context)"></openlmis-scan-input>';

        this.compileElement = function() {
            this.element = this.$compile(this.markup)(this.$scope);
            this.$rootScope.$apply();
        };

        /**
         * The controller reports through $applyAsync, so a digest must run before the DOM updates.
         */
        this.capture = function(payload) {
            this.captured(payload);
            this.$rootScope.$digest();
        };
    });

    afterEach(function() {
        if (this.element) {
            this.element.remove();
            this.element = undefined;
        }
    });

    it('should render the status indicator', function() {
        this.compileElement();

        expect(this.element.find('.openlmis-scan-input-icon').length).toBe(1);
        expect(this.element.find('.openlmis-scan-input-status').length).toBe(1);
    });

    it('should expose the status to assistive technology', function() {
        this.compileElement();

        var status = this.element.find('.openlmis-scan-input-status');

        expect(status.attr('role')).toEqual('status');
        expect(status.attr('aria-live')).toEqual('polite');
    });

    it('should start in the ready state', function() {
        this.compileElement();

        expect(this.element.find('.openlmis-scan-input').hasClass('is-ready')).toBe(true);
    });

    it('should render the success state after a scan was accepted', function() {
        this.compileElement();

        this.capture(PAYLOAD);

        expect(this.element.find('.openlmis-scan-input').hasClass('is-success')).toBe(true);
        expect(this.element.find('.openlmis-scan-input').hasClass('is-ready')).toBe(false);
    });

    it('should render the error state after a scan could not be parsed', function() {
        this.compileElement();

        this.capture('NOT A BARCODE');

        expect(this.element.find('.openlmis-scan-input').hasClass('is-error')).toBe(true);
    });

    it('should render some status text', function() {
        this.compileElement();

        var text = this.element.find('.openlmis-scan-input-status').text();

        expect(text.trim().length).toBeGreaterThan(0);
    });

    it('should pass the scan, the mode and the context to the handler', function() {
        this.compileElement();

        this.capture(PAYLOAD);

        expect(this.$scope.onScan).toHaveBeenCalled();
        expect(this.$scope.onScan.calls[0].args[0].gtin).toEqual('05890123456786');
        expect(this.$scope.onScan.calls[0].args[1]).toEqual('RECEIVE');
        expect(this.$scope.onScan.calls[0].args[2]).toBe(this.$scope.scanContext);
    });

    it('should not call the handler for a scan that could not be parsed', function() {
        this.compileElement();

        this.capture('NOT A BARCODE');

        expect(this.$scope.onScan).not.toHaveBeenCalled();
    });

    it('should stop listening when the scope is destroyed, as ng-if does', function() {
        this.compileElement();

        this.$scope.$destroy();

        expect(this.unsubscribe).toHaveBeenCalled();
    });

});
