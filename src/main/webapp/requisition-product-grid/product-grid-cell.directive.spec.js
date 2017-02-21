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

    'use strict';

    var compile, scope, directiveElem, COLUMN_SOURCES;

    beforeEach(function() {
        module('openlmis-templates');
    });

    beforeEach(module('requisition-product-grid', function($compileProvider) {
        $compileProvider.directive('lossesAndAdjustments', function() {
            var def = {
                priority: 100,
                terminal: true,
                restrict: 'EAC',
                template: '<a></a>',
            };
            return def;
        });
    }));

    beforeEach(function() {

        inject(function($compile, $rootScope, COLUMN_TYPES, _COLUMN_SOURCES_) {
            compile = $compile;
            scope = $rootScope.$new();
            COLUMN_SOURCES = _COLUMN_SOURCES_;
            scope.requisition = jasmine.createSpyObj('requisition', ['$getStockAdjustmentReasons']);

            scope.column = {
                type: COLUMN_TYPES.NUMERIC,
                name: "beginningBalance",
                source: COLUMN_SOURCES.USER_INPUT
            };
            scope.lineItem = {
                getFieldValue: function() {
                    return "readOnlyFieldValue";
                }
            }
        });

    });

    function getCompiledElement() {

        var rootElement = angular.element('<div><div product-grid-cell requisition="requisition" column="column" line-item="lineItem"></div></div>');
        var compiledElement = compile(rootElement)(scope);
        scope.$digest();
        return compiledElement;
    }

    it('should produce readonly cell if approved', function() {
        scope.requisition.$isApproved = function() {
            return true;
        }
        scope.requisition.$isReleased = function() {
            return false;
        }
        directiveElem = getCompiledElement();

        expect(directiveElem.html()).toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(0);
    });

    it('should produce readonly cell if released', function() {
        scope.requisition.$isReleased = function() {
            return true;
        }
        scope.requisition.$isApproved = function() {
            return false;
        }
        directiveElem = getCompiledElement();

        expect(directiveElem.html()).toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(0);
    });

    it('should produce editable cell', function() {
        scope.requisition.$isApproved = function() {
            return false;
        }
        scope.requisition.$isReleased = function() {
            return false;
        }
        scope.requisition.$isAuthorized = function() {
            return false;
        }
        directiveElem = getCompiledElement();

        expect(directiveElem.html()).not.toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(1);
    });

    it('should produce losesAndAdjustment cell', function() {
        scope.requisition.$isApproved = function() {
            return false;
        }
        scope.requisition.$isReleased = function() {
            return false;
        }
        scope.requisition.$isAuthorized = function() {
            return false;
        }
        scope.column.name = "totalLossesAndAdjustments";
        directiveElem = getCompiledElement();

        expect(directiveElem.html()).not.toContain("readOnlyFieldValue");
        expect(directiveElem.find("a").length).toEqual(1);
    });
});
