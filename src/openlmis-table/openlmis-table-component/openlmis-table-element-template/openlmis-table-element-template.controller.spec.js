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

describe('openlmisTableElementTemplateController', function() {
    var $controller,
        $compile,
        $rootScope,
        $timeout,
        uniqueIdService,
        jQueryMock,
        openlmisTableService,
        $scope,
        ctrl;

    beforeEach(module('openlmis-table'));

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function(_$controller_, _$compile_, _$rootScope_, _$timeout_, _uniqueIdService_,
        _openlmisTableService_) {
        $controller = _$controller_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        uniqueIdService = _uniqueIdService_;
        openlmisTableService = _openlmisTableService_;

        jQueryMock = jasmine.createSpy('jQuery').andCallFake(function(selector) {
            return {
                append: jasmine.createSpy('append'),
                selector: selector
            };
        });

        window.jQuery = jQueryMock;

        $scope = $rootScope.$new();

        ctrl = $controller('openlmisTableElementTemplateController', {
            $scope: $scope,
            $compile: $compile,
            $timeout: $timeout,
            uniqueIdService: uniqueIdService,
            jQuery: jQueryMock,
            openlmisTableService: openlmisTableService
        });
        ctrl.elementConfig = {};
    }));

    afterEach(function() {
        delete window.jQuery;
    });

    describe('$onInit', function() {
        it('should generate a unique divId', function() {
            ctrl.$onInit();

            expect(ctrl.divId).toBeDefined();
            expect(ctrl.divId).not.toBe('');
        });

        it('should not call injectHtmlContent if elementConfig.template is undefined', function() {
            var injectHtmlContentSpy = spyOn(ctrl, 'injectHtmlContent');

            ctrl.elementConfig = {};

            ctrl.$onInit();

            expect(injectHtmlContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('injectHtmlContent', function() {
        it('should compile and append the HTML content if compilation is successful', function() {
            ctrl.divId = 'unique-id';
            ctrl.elementConfig = {
                template: function() {
                    return '<div>Compiled Template</div>';
                },
                item: {}
            };

            spyOn($compile, 'call').andCallFake(function() {
                return angular.element('<div>Compiled Template</div>');
            });

            ctrl.injectHtmlContent();

            expect(jQueryMock).toHaveBeenCalledWith('#unique-id');
        });

        it('should append the raw HTML content if compilation fails', function() {
            ctrl.divId = 'unique-id';
            ctrl.elementConfig = {
                template: function() {
                    return '<div>Raw HTML</div>';
                },
                item: {}
            };

            spyOn($compile, 'call').andReturn(angular.element([]));

            ctrl.injectHtmlContent();

            expect(jQueryMock).toHaveBeenCalledWith('#unique-id');
        });
    });

    describe('getItemTemplateValue', function() {
        it('should call template function if template is a function', function() {
            var item = {
                name: 'Item 1'
            };
            var templateFn = jasmine.createSpy('template').andReturn('Item: item.name');

            var result = ctrl.getItemTemplateValue(templateFn, item);

            expect(templateFn).toHaveBeenCalledWith(item);
            expect(result).toBe('Item: item.name');
        });

        it('should replace item properties with their values from openlmisTableService', function() {
            var item = {
                name: 'Item 1',
                quantity: 10
            };
            var template = 'Item: item.name, Quantity: item.quantity';

            spyOn(openlmisTableService, 'getElementPropertyValue').andCallFake(function(item, property) {
                return item[property];
            });

            var result = ctrl.getItemTemplateValue(template, item);

            expect(openlmisTableService.getElementPropertyValue).toHaveBeenCalledWith(item, 'name');
            expect(openlmisTableService.getElementPropertyValue).toHaveBeenCalledWith(item, 'quantity');
            expect(result).toBe('Item: Item 1, Quantity: 10');
        });

        it('should return the original template if item properties are not found', function() {
            var item = {};
            var template = 'Item: item.name, Quantity: item.quantity';

            var result = ctrl.getItemTemplateValue(template, item);

            expect(result).toBe('Item: item.name, Quantity: item.quantity');
        });
    });
});
