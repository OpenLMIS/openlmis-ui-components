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
describe('ProductGridCell', function() {

    var $compile, scope, requisition, directiveElem, requisitionValidatorMock, authorizationServiceSpy, TEMPLATE_COLUMNS;

    beforeEach(function() {
        module('requisition-product-grid', function($compileProvider) {
            $compileProvider.directive('lossesAndAdjustments', function() {
                var def = {
                    priority: 100,
                    terminal: true,
                    restrict: 'EAC',
                    template: '<a></a>',
                };
                return def;
            });
        });

        module('openlmis-templates', function($provide) {

            requisitionValidatorMock = jasmine.createSpyObj('requisitionValidator',
                ['validateLineItem']);
            $provide.service('requisitionValidator', function() {
                return requisitionValidatorMock;
            });

            authorizationServiceSpy = jasmine.createSpyObj('authorizationService', ['hasRight', 'isAuthenticated']);
            authorizationServiceSpy.hasRight.andReturn(true);
            authorizationServiceSpy.isAuthenticated.andReturn(true);
            $provide.service('authorizationService', function() {
                return authorizationServiceSpy;
            });
        });

        inject(function($injector) {
            $compile = $injector.get('$compile');
            scope = $injector.get('$rootScope').$new();
            TEMPLATE_COLUMNS =  $injector.get('TEMPLATE_COLUMNS');

            requisition = jasmine.createSpyObj('requisition', [
                '$getStockAdjustmentReasons', '$isApproved', '$isReleased', '$isAuthorized',
                '$isInApproval'
            ]);
            requisition.template = {};
            requisition.template.columnsMap = { 'col1': 'val1' };
            requisition.program = {
                code: 'CODE'
            };

            scope.requisition = requisition;

            scope.column = {
                type: $injector.get('COLUMN_TYPES').NUMERIC,
                name: "beginningBalance",
                source: $injector.get('COLUMN_SOURCES').USER_INPUT
            };

            scope.lineItem = jasmine.createSpyObj('lineItem', ['getFieldValue',
                'updateDependentFields'])

            scope.lineItem.getFieldValue.andCallFake(function() {
                return "readOnlyFieldValue";
            });

            scope.lineItem.$errors = {};
        });
    });

    it('should produce read-only cell if approved', function() {
        scope.requisition.$isApproved.andReturn(true);
        scope.requisition.$isReleased.andReturn(false);

        directiveElem = getCompiledElement();

        expect(directiveElem.html()).toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(0);
    });

    it('should produce read-only cell if released', function() {
        scope.requisition.$isApproved.andReturn(false);
        scope.requisition.$isReleased.andReturn(true);

        directiveElem = getCompiledElement();

        expect(directiveElem.html()).toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(0);
    });

    it('should produce read-only cell if authorized', function() {
        scope.requisition.$isApproved.andReturn(false);
        scope.requisition.$isReleased.andReturn(false);
        scope.requisition.$isInApproval.andReturn(true);
        scope.requisition.$isAuthorized.andReturn(false);

        directiveElem = getCompiledElement();

        expect(directiveElem.html()).toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(0);
    });

    it('should produce read-only cell if in approval', function() {
        scope.requisition.$isApproved.andReturn(false);
        scope.requisition.$isReleased.andReturn(false);
        scope.requisition.$isInApproval.andReturn(false);
        scope.requisition.$isAuthorized.andReturn(true);

        directiveElem = getCompiledElement();

        expect(directiveElem.html()).toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(0);
    });

    it('should produce read-only cell if authorized and column is approved quantity', function() {
        scope.column.name = TEMPLATE_COLUMNS.APPROVED_QUANTITY;

        authorizationServiceSpy.hasRight.andReturn(false);

        scope.requisition.$isApproved.andReturn(false);
        scope.requisition.$isReleased.andReturn(false);
        scope.requisition.$isInApproval.andReturn(true);
        scope.requisition.$isAuthorized.andReturn(false);

        directiveElem = getCompiledElement();

        expect(directiveElem.html()).toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(0);
    });

    it('should produce editable cell if user has no right to approve', function() {
        scope.column.name = TEMPLATE_COLUMNS.APPROVED_QUANTITY;

        scope.requisition.$isApproved.andReturn(false);
        scope.requisition.$isReleased.andReturn(false);
        scope.requisition.$isInApproval.andReturn(true);
        scope.requisition.$isAuthorized.andReturn(false);

        directiveElem = getCompiledElement();

        expect(directiveElem.html()).not.toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(1);
    });

    it('should produce editable cell', function() {
        scope.requisition.$isApproved.andReturn(false);
        scope.requisition.$isReleased.andReturn(false);
        scope.requisition.$isAuthorized.andReturn(false);
        scope.requisition.$isInApproval.andReturn(false);

        directiveElem = getCompiledElement();

        expect(directiveElem.html()).not.toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(1);
    });

    it('should produce losesAndAdjustment cell', function() {
        scope.requisition.$isApproved.andReturn(false);
        scope.requisition.$isReleased.andReturn(false);
        scope.requisition.$isAuthorized.andReturn(false);
        scope.column.name = "totalLossesAndAdjustments";

        directiveElem = getCompiledElement();

        expect(directiveElem.html()).not.toContain("readOnlyFieldValue");
        expect(directiveElem.find("a").length).toEqual(1);
    });

    it('should validate the entire line item after updating fields', function() {
        var element = getCompiledElement(),
            input = element.find('input'),
            inputScope = angular.element(angular.element(input)).scope(),
            validate = inputScope.validate;

        validate();

        expect(requisitionValidatorMock.validateLineItem).toHaveBeenCalledWith(
            scope.lineItem, requisition.template.columnsMap, requisition);
        expect(scope.lineItem.updateDependentFields).toHaveBeenCalledWith(
            scope.column, requisition);
    });

    function getCompiledElement() {
        var rootElement = angular.element('<div><div product-grid-cell requisition="requisition" column="column" line-item="lineItem"></div></div>');
        var compiledElement = $compile(rootElement)(scope);
        scope.$digest();
        return compiledElement;
    }
});
