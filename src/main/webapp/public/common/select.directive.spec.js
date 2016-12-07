/*describe('Select directive', function() {

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
        element = angular.element(element[0]); // really?!?!
    }));

    it('will disable element if single option and set value', function(){
        scope.options = [1, 2, 3, 4];
        scope.$apply();
        expect(element.attr("disabled")).not.toBe(true);

        scope.options = [];
        scope.$apply();
        expect(element.attr("disabled")).toBe("disabled");
    });

    it('shows placeholder attribute as first option', function(){
        var firstOption = element.children('option:first');
        expect(firstOption.text()).toBe('select.placeholder.default');
    });

    it('reads the elements placeholder value', function(){
       element = $compile(
            '<select ng-model="value" placeholder="something"></select>'
            )(scope);
        scope.$apply();

        var firstOption = element.children('option:first');
        expect(firstOption.text()).toBe('something');
    });

    it("won't overwrite a placeholder that is set as an option", function(){
        element = $compile(
            '<select ng-model="value" placeholder="something"><option>My Placeholder</option></select>'
            )(scope);
        scope.$apply();

        var placeholder = element.children('option.placeholder');
        expect(placeholder.text()).toBe('something');
    });

});
*/
