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

    beforeEach(function() {
        this.openlmisTableFiltersControllerMock = jasmine.createSpyObj('OpenlmisTableFiltersController', [
            'registerElement', 'getFilterButton'
        ]);

        var openlmisTableFiltersControllerMock = this.openlmisTableFiltersControllerMock;
        module('openlmis-table-filter', function($controllerProvider) {
            $controllerProvider.register('OpenlmisTableFiltersController', function() {
                return openlmisTableFiltersControllerMock;
            });
        });

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.$scope = this.$rootScope.$new();

        var context = this;
        this.compileMarkup = function(markup) {
            var element = context.$compile(markup)(context.$scope);
            context.$scope.$apply();
            return element;
        };
    });

    it('should add openlmis-table-filters directive to openlmis-table-container', function() {
        var markup = '<div class="openlmis-table-container"></div>';

        var container = this.compileMarkup(markup);

        expect(container.attr('openlmis-table-filters')).not.toBeUndefined();
        expect(container.controller('openlmis-table-filters')).not.toBeUndefined();
    });

    it('should register openlmis-table-container child forms with OpenlmisTableFiltersController', function() {
        var markup =
            '<div class="openlmis-table-container">' +
                '<form></form>' +
            '</div>';

        var container = this.compileMarkup(markup);

        expect(container.find('form[openlmis-table-filter-form]').length).toBe(1);
        expect(this.openlmisTableFiltersControllerMock.registerElement).toHaveBeenCalled();
    });

    it('will only apply openlmis-table-filter to forms that are direct descendants of openlmis-table-container',
        function() {
            var markup =
                '<div class="openlmis-table-container">' +
                    '<form></form>' +
                    '<div>' +
                        '<form></form>' +
                    '</div>' +
                '</div>';

            var container = this.compileMarkup(markup);

            expect(container.find('form').length).toBe(2);
            expect(container.find('form[openlmis-table-filter-form]').length).toBe(1);
        });

});
