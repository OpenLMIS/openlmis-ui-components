describe('ProductGridCell', function() {

    'use strict';

    var compile, scope, directiveElem, Source;

    beforeEach(function() {
        module('openlmis-templates');
    });

    beforeEach(module('openlmis.requisitions', function($compileProvider) {
        $compileProvider.directive('lossesAndAdjustments', function() {
            var def = {
                priority: 100,
                terminal: true,
                restrict:'EAC',
                template:'<a></a>',
            };
            return def;
        });
    }));

    beforeEach(function(){

        inject(function($compile, $rootScope, Type, _Source_){
            compile = $compile;
            scope = $rootScope.$new();
            Source = _Source_;
            scope.requisition = jasmine.createSpyObj('requisition', ['$getStockAdjustmentReasons']);

            scope.column = {
                type: Type.NUMERIC,
                name: "beginningBalance",
                source: Source.USER_INPUT
            };
            scope.lineItem = {
                getFieldValue: function() {
                    return "readOnlyFieldValue";
                }
            }
        });

    });

        function getCompiledElement(){

            var rootElement = angular.element('<div product-grid-cell></div>');
            var compiledElement = compile(rootElement)(scope);
            scope.$digest();
            return compiledElement;
        }

        it('should produce readonly cell', function () {
            scope.requisition.$isApproved = function() { return true; }
            directiveElem = getCompiledElement();

            expect(directiveElem.html()).toContain("readOnlyFieldValue");
            expect(directiveElem.find("input").length).toEqual(0);
        });

        it('should produce editable cell', function () {
            scope.requisition.$isApproved = function() { return false; }
            scope.requisition.$isAuthorized = function() { return false; }
            directiveElem = getCompiledElement();

            expect(directiveElem.html()).not.toContain("readOnlyFieldValue");
            expect(directiveElem.find("input").length).toEqual(1);
        });

        it('should produce losesAndAdjustment cell', function () {
            scope.requisition.$isApproved = function() { return false; }
            scope.requisition.$isAuthorized = function() { return false; }
            scope.column.name = "totalLossesAndAdjustments";
            directiveElem = getCompiledElement();

            expect(directiveElem.html()).not.toContain("readOnlyFieldValue");
            expect(directiveElem.find("a").length).toEqual(1);
        });
    });
