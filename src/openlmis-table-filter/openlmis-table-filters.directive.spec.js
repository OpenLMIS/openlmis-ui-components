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

ddescribe('openlmis-table-container-filter directive', function() {

    var container, $scope, ctrlSpy;

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
        });

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        $scope = $rootScope.$new();
        container = compileMarkup(
            '<div openlmis-table-filters>' +
                '<div class="toolbar"></div>' +
            '</div>'
        );
    });

    it('should add filter button with popover if any filter has been registered', function() {
        var element = container.find('button.filters');

        expect(element.length).toBe(1);
    });

    //TODO: DRY this a bit, as it is repeated in numerous tests
    function compileMarkup(markup) {
        var element = $compile(markup)($scope);

        angular.element('body').append(element);
        $scope.$apply();

        return element;
    }

});
