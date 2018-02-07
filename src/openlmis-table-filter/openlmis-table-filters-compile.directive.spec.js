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

describe('openlmis-table-filter compile directive', function() {

    var $scope, $compile, ctrlSpy;

    beforeEach(function() {
        module('openlmis-table-filter', function($controllerProvider) {

            // Stubs out DOM manipulation by OpenlmisTableFiltersController
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
    });

    it('should add openlmis-table-filters directive to openlmis-table-container', function() {
        var container = compileMarkup('<div class="openlmis-table-container"></div>');

        expect(container.attr('openlmis-table-filters')).not.toBeUndefined();
        expect(container.controller('openlmis-table-filters')).not.toBeUndefined();
    });

    it('should register openlmis-table-container child forms with OpenlmisTableFiltersController', function() {
        var container = compileMarkup('<div class="openlmis-table-container"><form></form></div>');

        expect(container.find('form[openlmis-table-filter-form]').length).toBe(1);
        expect(ctrlSpy.registerElement).toHaveBeenCalled();
    });

    it('will only apply openlmis-table-filter to forms that are direct descendants of openlmis-table-container', function() {
        var container = compileMarkup('<div class="openlmis-table-container"><form></form><div><form></form></div></div>');

        expect(container.find('form').length).toBe(2);
        expect(container.find('form[openlmis-table-filter-form]').length).toBe(1);
    });

    function compileMarkup(markup) {
        var element = $compile(markup)($scope);

        angular.element('body').append(element);
        $scope.$apply();

        return element;
    }

});
