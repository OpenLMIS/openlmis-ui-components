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
     * @restrict E
     * @name openlmis-table.directive:stickyTableHeaders
     *
     * @description
     * Sticks table header cells to the top when user is scrolling vertically.
     * It allows user to see table header all the time.
     * Table have to be inside element with openlmis-table-container class.
     *
     * @example
     * ```
     * <div class="openlmis-table-container">
     *   <table>
     *     <thead>
     *       <tr>
     *         <th>Number</th>
     *         <th>Name</th>
     *       </tr>
     *     </thead>
     *     <tbody>
     *       <tr><td>123</td><td>Foo</td></tr>
     *       <tr><td>456</td><td>Bar</td></tr>
     *     </tbody>
     *   </table>
     * </div>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('table', directive);

    directive.$inject = ['$window', 'jQuery'];
    function directive($window, jQuery) {

        return {
            restrict: 'E',
            priority: 11,
            link: link
        };

        function link(scope, element) {
            // Only check for sticky elements if within a table container
            if (element.parents('.openlmis-table-container').length === 0) {
                return ;
            }

            var parent = element.parent(),
                window = angular.element($window),
                containerOffset,
                // functions that update cell position
                blits = [];

            scope.$watchCollection(function() {
                return element.find('thead th');
            }, updateStickyElements);

            // If the window changes sizes, update the view
            window.bind('resize', animate);

            element.on('$destroy', function() {
                window.unbind('resize', animate);
                window.unbind('scroll', animate);
                parent = undefined;
            });

            /**
             * @ngdoc method
             * @name updateStickyElements
             * @methodOf openlmis-table.directive:stickyTableHeaders
             *
             * @description
             * Updates the functions that animate each sticky header.
             */
            function updateStickyElements() {
                window.unbind('scroll', animate);

                // reset in case it changed...
                parent = element.parent();
                window.bind('scroll', animate);

                // Make sure offsets are correct
                element.find('thead th')
                    .css('top', '0px');

                blits = [];
                element.find('thead th')
                    .each(function(index, cell) {
                        setUpBlits(angular.element(cell));
                    });

                animate();
            }

            var animationFrameId;
            function animate() {
                if (animationFrameId) {
                    $window.cancelAnimationFrame(animationFrameId);
                }
                animationFrameId = $window.requestAnimationFrame(blit);
            }

            /**
             * @ngdoc method
             * @name blit
             * @methodOf openlmis-table.directive:stickyTableHeaders
             *
             * @description
             * Updates view items, and animates cells
             */
            function blit() {

                containerOffset = parent[0].getBoundingClientRect().top;

                if (containerOffset > 0 || containerOffset + parent[0].clientHeight < 0) {
                    jQuery('.stuck-top', element)
                        .css('top', '0px');
                    return;
                }

                angular.forEach(blits, function(blit) {
                    blit();
                });
            }

            /**
             * @ngdoc method
             * @name setUpBlits
             * @methodOf openlmis-table.directive:stickyTableHeaders
             *
             * @description
             * Create an animation function to position a header cell on the top.
             */
            function setUpBlits(cell) {

                blits.push(function() {
                    cell.addClass('stuck stuck-top');
                    cell.css('top', -1 * containerOffset + 'px');
                });
            }
        }
    }

})();
