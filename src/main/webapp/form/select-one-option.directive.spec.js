describe('Select one option directive', function() {

    'use strict';

    var $compile, scope, element;

    beforeEach(function() {
        module('openlmis-templates');
    });

    beforeEach(module('openlmis-core'));

    beforeEach(inject(function(_$compile_, $rootScope){
        $compile = _$compile_;

        scope = $rootScope.$new();
        scope.options = [];
        element = $compile(
            '<select ng-model="value" ng-options="option for option in options"></select>'
            )(scope);
        scope.$apply();
        element = angular.element(element[0]);
    }));

    it('will disable element if there are no options', function(){
        scope.options = [1, 2, 3, 4];
        scope.$apply();
        expect(element.attr("disabled")).not.toBe(true);

        scope.options = [];
        scope.$apply();
        expect(element.attr("disabled")).toBe("disabled");
    });

    it('will set ngModel to first option and disable the select, if there is only one option', function(){
        scope.options = ["foo bar"];
        scope.$apply();
        expect(element.attr("disabled")).toBe("disabled");
        expect(scope.value).toBe("foo bar");
    });

});
