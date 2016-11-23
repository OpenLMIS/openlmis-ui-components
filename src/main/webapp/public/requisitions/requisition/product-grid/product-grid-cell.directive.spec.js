describe('ProductGridCell', function() {

	'use strict';

    var compile, scope, directiveElem, Column, Source;

    beforeEach(function(){
      module('openlmis.requisitions');
      module('openlmis-templates');
    });

    beforeEach(function(){

      inject(function($compile, $rootScope, Type, _Column_, _Source_){
        compile = $compile;
        scope = $rootScope.$new();
        Column = _Column_;
        Source = _Source_;
        scope.requisition = {};

        scope.column = {
            type: Type.NUMERIC,
            name: "beginningBalance",
            source: Source.USER_INPUT
        };
        scope.lineItem = {
            getColumnValue: function() {
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
