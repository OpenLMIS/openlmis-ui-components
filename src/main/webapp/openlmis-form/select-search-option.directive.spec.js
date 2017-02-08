describe('Select search option directive', function() {

    'use strict';

    var $compile, scope, element;

    beforeEach(function() {

        module('openlmis-templates');
        module('openlmis-form');

        inject(function(_$compile_, $rootScope) {
            $compile = _$compile_;

            scope = $rootScope.$new();
            scope.options = [];
            element = $compile(
                '<select ng-model="value" ng-options="option for option in options"></select>'
                )(scope);
            scope.$apply();
            element = angular.element(element[0]);
        });
    });

    describe('search-able pop-out', function() {

        it('should not set pop-out class when there is less than 10 options', function() {
            expect(element.hasClass('pop-out')).toBe(false);
        });

        it('should set pop-out class when there is more than 10 options', function() {
            scope.options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            scope.$apply();
            expect(element.hasClass('pop-out')).toBe(true);
        });
    });

});
