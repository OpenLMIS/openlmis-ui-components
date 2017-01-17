(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-table:stickyTableColumns
     *
     * @description
     * Allows a user to stick a table heading or table cell element by adding the class
     * sticky to the element. This will automatically stick the element to the left or
     * right side of the table using relative positioning.
     *
     * Only tables that are surrouned by a `.table-container` class will have sticky columns.
     *
     * @example
     * ```
     * <div class="table-container">
     *   <table >
     *     <thead>
     *       <tr>
     *         <th class="sticky">Number</th>
     *         <th >Name</th>
     *       </tr>
     *     </thead>
     *     <tbody title="Category Title">
     *       <tr><td class="sticky">123</td><td >Foo</td></tr>
     *       <tr><td class="sticky">456</td><td>Bar</td></tr>
     *     </tbody>
     *   </table>
     * </div>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('table', directive);

    directive.$inject = ['$window'];
    function directive($window) {

        return {
            restrict: 'E',
            link: link
        };

        function link(scope, element, attrs) {
            // Only check for sticky elements if within a table container
            if(element.parents('.table-container').length == 0){
                return ;
            }

            var parent = element.parent(),
            // Values used by cells to calculate offset...
            parentWidth,
            tableWidth,
            leftEdge,
            rightEdge,
            blits = []; // functions that update cell position

            // Updates blit array...
            parent.on('scroll', blit);
            updateStickyElements();

            // If there are new items added to the grid, redraw
            scope.$watch(function(){
                return element[0].querySelectorAll('.sticky:not(.sticky-added)').length;
            }, updateStickyElements);
            // If the window changes sizes, update the view 
            angular.element($window).bind('resize', updateStickyElements);

            /**
             * @ngdoc function
             * @name updateStickyElements
             * @methodOf openlmis-table:stickyTableColumns
             *
             * @description
             * Updates the functions that animate each sticky element.
             *
             */
            function updateStickyElements(){
                blits = [];

                // Reset DOM Elements
                var stuckElements = element[0].querySelectorAll('.sticky-added');
                angular.forEach(stuckElements, function(cell){
                    angular.element(cell).removeClass('sticky-added');
                });

                // Create blit functions
                var pinnedCellsQuery = element[0].querySelectorAll('.sticky'); 
                angular.forEach(pinnedCellsQuery, function(cell) {
                    cell = angular.element(cell);
                    cell.addClass('sticky-added');
                    blits.push(setUpCell(cell));
                });

                blit();
            }

            /**
             * @ngdoc function
             * @name blit
             * @methodOf openlmis-table:stickyTableColumns
             *
             * @description
             * Updates view items, and animates cells
             *
             */
            function blit(){
                parentWidth = parent.width();
                tableWidth = element.width();

                var offset = 0 - element.position().left;

                leftEdge = offset;
                rightEdge = parentWidth + offset;

                angular.forEach(blits, function(blit){
                    blit(offset);
                });
            }

            /**
             * @ngdoc function
             * @name setUpCell
             * @methodOf openlmis-table:stickyTableColumns
             *
             * @description
             * Creates set of functions for element that updates items
             *
             */
            function setUpCell(cell){
                var cellOffset = cell.position().left;
                var cellWidth = cell.width();

                return blitCell;

                /**
                 * @ngdoc function
                 * @name blitCell
                 * @methodOf openlmis-table:stickyTableColumns
                 *
                 * @description
                 * Calculation and manipulation of position for each cell 
                 *
                 */
                function blitCell(offset){
                    if(rightEdge - tableWidth > 0){ 
                        return; // if the end of the table has been reached, stop
                    }

                    if(cellOffset + cellWidth > rightEdge){ // if the column is far away on the right...
                        setPosition(rightEdge - tableWidth);
                        cell.addClass('stuck');
                        cell.addClass('stuck-right');
                    } else if(cellOffset < leftEdge) {
                        setPosition(leftEdge);
                        cell.css('left', offset + 'px');
                        cell.addClass('stuck');
                        cell.addClass('stuck-left');
                    } else {
                        setPosition(0);
                        cell.removeClass('stuck');
                        cell.removeClass('stuck-left');
                        cell.removeClass('stuck-right');
                    }
                }

                /**
                 * @ngdoc function
                 * @name setPosition
                 * @methodOf openlmis-table:stickyTableColumns
                 *
                 * @description
                 * Updates an element's transform property to take advantage of simpler rendering.
                 * See the following article for an explination of why we are using transform.
                 * https://www.kirupa.com/html5/animating_movement_smoothly_using_css.htm
                 *
                 */
                function setPosition(position){
                    var transformProperties = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];
                    
                    angular.forEach(transformProperties, function(property){
                        cell.css(property, 'translate3d(' + position + 'px, 0px, 0px);');
                    });
                }
            }

        }
    }

})();
