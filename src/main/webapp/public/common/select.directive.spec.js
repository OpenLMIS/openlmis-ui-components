describe('Select directive', function() {

    'use strict';

    var scope, element;

    beforeEach(function() {
        module('openlmis-templates');
    });

    beforeEach(module('openlmis-core'));

    beforeEach(inject(function($compile, $rootScope){
        scope = $rootScope.$new();
        scope.options = [];
        var html = '<select openlmis-select ng-model="value" ng-options="option for option in options"></select>';
        element = $compile()(scope);
    }));

    it('will disable element if single option and set value', function(){
        scope.options = [1, 2, 3, 4];

        scope.$apply();

        expect(element.attr("disabled")).toBe(true); 
    });

    it('shows placeholder attribute as first option', function(){

    });

});
