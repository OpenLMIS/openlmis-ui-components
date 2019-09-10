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

    beforeEach(function() {
        this.openlmisTableFiltersControllerSpy = jasmine.createSpyObj('OpenlmisTableFiltersController', [
            'registerElement', 'getFilterButton'
        ]);

        var openlmisTableFiltersControllerSpy = this.openlmisTableFiltersControllerSpy;
        module('openlmis-table-filter', function($compileProvider, $controllerProvider) {
            $compileProvider.directive('table', function() {
                var def = {
                    priority: 100,
                    terminal: true,
                    restrict: 'E'
                };
                return def;
            });

            $controllerProvider.register('OpenlmisTableFiltersController', function() {
                return openlmisTableFiltersControllerSpy;
            });
        });

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        var markup =
            '<section class="openlmis-table-container">' +
                '<div openlmis-table-filter-form></div>' +
                '<table>' +
                    '<thead><tr><th></th></tr></thead>' +
                    '<tbody><tr><td></td></tr></tbody>' +
                '</table>' +
            '</section>';

        this.template = this.$compile(markup)(this.$rootScope.$new());
        this.$rootScope.$apply();
    });

    it('should register element in the openlmisTableFilters', function() {
        expect(this.openlmisTableFiltersControllerSpy.registerElement)
            .toHaveBeenCalledWith(angular.element(this.template.find('[openlmis-table-filter-form]')[0]), 'body');
    });

    it('should register element with .modal-content as container', function() {
        var markup =
            '<div class="modal-content">' +
                '<section class="openlmis-table-container">' +
                    '<div openlmis-table-filter-form></div>' +
                    '<table>' +
                        '<thead><tr><th></th></tr></thead>' +
                        '<tbody><tr><td></td></tr></tbody>' +
                    '</table>' +
                '</section>' +
            '</div>';

        this.template = this.$compile(markup)(this.$rootScope.$new());
        this.$rootScope.$apply();

        expect(this.openlmisTableFiltersControllerSpy.registerElement)
            .toHaveBeenCalledWith(angular.element(this.template.find('[openlmis-table-filter-form]')[0]),
                '.modal-content');
    });

});
