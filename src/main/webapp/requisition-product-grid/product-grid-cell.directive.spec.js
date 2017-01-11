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

    it('should produce readonly cell', function() {
        scope.requisition.$isApproved = function() {
            return true;
        }
        directiveElem = getCompiledElement();

        expect(directiveElem.html()).toContain("readOnlyFieldValue");
        expect(directiveElem.find("input").length).toEqual(0);
    });

    it('should produce editable cell', function() {
        scope.requisition.$isApproved = function() {
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
        scope.requisition.$isAuthorized = function() {
            return false;
        }
        scope.column.name = "totalLossesAndAdjustments";
        directiveElem = getCompiledElement();

        expect(directiveElem.html()).not.toContain("readOnlyFieldValue");
        expect(directiveElem.find("a").length).toEqual(1);
    });
});
