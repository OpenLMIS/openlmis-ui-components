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

describe('openlmis-table-container-filters directive', function() {

    beforeEach(function() {
        module('openlmis-table-filter', function($compileProvider) {
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
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.$timeout = $injector.get('$timeout');
        });

        this.$scope = this.$rootScope.$new();

        this.compileMarkup = function compileMarkup(markup) {
            var element = this.$compile(markup)(this.$scope);
            this.$rootScope.$apply();
            return element;
        };
    });

    it('should add filter button with popover if any filter has been registered', function() {
        var markup =
            '<div class="openlmis-table-container">' +
                '<form></form>' +
                '<table></table>' +
            '</div>';

        var container = this.compileMarkup(markup);

        expect(container.find('button.filters').length).toBe(1);
    });

    it('should not add button with popover if none filters have been registered', function() {
        var markup =
            '<div class="openlmis-table-container">' +
                '<table></table>' +
            '</div>';

        var container = this.compileMarkup(markup);

        expect(container.find('button.filters').length).toBe(0);
    });

});
