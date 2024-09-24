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

(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @restrict C
     * @name openlmis-table.directive:openlmisTableContainer
     *
     * @description
     * Checks if there is a single table element with in the container, if so the contents are arranged to meet our
     * custom layout.
     *
     * @example
     * This one can be added as class to element that wraps 'table' element, 'form' element or both.
     * ```
     * <div class="openlmis-table-container">
     *     <table></table>
     *     <form></form>
     * </div>
     * ```
     *
     * This is how it will look like after rendering:
     * ```
     * <div class="openlmis-table-container">
     *     <table>
     *         <div class="toolbar"></div>
     *     </table>
     *     <form>
     *         <div class="toolbar"></div>
     *     </form>
     * <div>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('openlmisTableContainer', directive);

    directive.$inject = [];

    function directive() {
        var directive = {
            compile: compile,
            restrict: 'C',
            priority: 10
        };
        return directive;
    }

    function compile(element) {
        if (element.children('table').length === 1 || element.children('openlmis-table').length === 1) {
            var toolbar = angular.element('<div class="toolbar"></div>'),
                row = angular.element('<div class="row"></div>'),
                main = angular.element('<div class="main"></div>');

            element.children()
                .each(function(index, childElement) {
                    var nonToolbarComponents = ['TABLE', 'FORM', 'OPENLMIS-PAGINATION', 'OPENLMIS-TABLE'];
                    if (nonToolbarComponents.indexOf(childElement.nodeName) === -1) {
                        toolbar.append(childElement);
                    } else if (childElement.nodeName === 'FORM') {
                        row.append(childElement);
                    }
                });

            main.append(toolbar);

            var table = element.children('table');
            if (table.length === 0) {
                table = element.children('openlmis-table');
            }
            table.appendTo(main)
                .wrap('<div class="openlmis-flex-table"></div>');
            table.parent()
                .after(element.children('openlmis-pagination'));

            row.append(main);
            element.append(row);
        }
    }
})();
