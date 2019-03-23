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

describe('openlmisTableFilterForm directive', function() {

    var template, ctrlSpy, $rootScope, $compile, $scope;

    beforeEach(function() {
        module('openlmis-table-filter', function($compileProvider, $controllerProvider) {
            $compileProvider.directive('table', function() {
                var def = {
                    priority: 100,
                    terminal: true,
                    restrict: 'E'
                };
                return def;
            });

            ctrlSpy = jasmine.createSpyObj('OpenlmisTableFiltersController', [
                'registerElement', 'getFilterButton'
            ]);
            $controllerProvider.register('OpenlmisTableFiltersController', function() {
                return ctrlSpy;
            });
        });

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        $scope = $rootScope.$new();
        ctrlSpy.getFilterButton.and.returnValue(compileMarkup('<button></button>'));
        template = compileMarkup(
            '<section class="openlmis-table-container">' +
                '<div openlmis-table-filter-form></div>' +
                '<table>' +
                    '<thead><tr><th></th></tr></thead>' +
                    '<tbody><tr><td></td></tr></tbody>' +
                '</table>' +
            '</section>'
        );
    });

    it('should register element in the openlmisTableFilters', function() {
        expect(ctrlSpy.registerElement)
            .toHaveBeenCalledWith(angular.element(template.find('[openlmis-table-filter-form]')[0]));
    });

    function compileMarkup(markup) {
        var element = $compile(markup)($scope);

        angular.element('body').append(element);
        $scope.$apply();

        return element;
    }

});
