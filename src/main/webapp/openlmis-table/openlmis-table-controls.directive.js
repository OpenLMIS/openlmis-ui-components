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
     * @restrict 'C'
     * @name openlmis-table.directive:openlmisTableControls
     *
     * @description
     * Positions the table sort order correctly in a table's container.
     *
     * @example
     * ```
     * <div class="openlmis-table-container">
     * <form class="openlmis-table-controls">
     * 	 <label for="table-sort-order">Sort items by</label>
     *   <select id="table-sort-order">
     *     <option selected="selected">Name</option>
     *   </select>
     *   <input type="submit" value="Sort items" />
     * </form>
     * <table>
     *   <tbody title="Category Title">
     *     <tr><td>123</td><td>456</td></tr>
     *     <tr><td>Foo</td><td>Bar</td></tr>
     *   </tbody>
     * </table>
     * </div>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('openlmisTableControls', directive);

    directive.$inject = ['$window'];

    function directive($window) {
        return {
            restrict: 'C',
            replace: false,
            link: link
        };

        function link(scope, element, attrs) {
            var parent = angular.element(element.parent()[0]);

            angular.element($window).bind('resize', updatePadding);

            scope.$watch(function() {
                return element.css('height');
            }, updatePadding);

            function updatePadding() {
                parent.css('padding-top', element.css('height'));
            }

            element.on('$destroy', function() {
                parent = undefined;
                angular.element($window).unbind('resize', updatePadding);
            });
        }
    }

})();
