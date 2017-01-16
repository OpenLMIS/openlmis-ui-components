(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-table:tablePinnedColumns
     *
     * @description
     * Allows user to pin columns to the left side of table.
     *
     * @example
     * ```
     * <div class="table-container">
     * <form table-sort-order>
     *   <label for="table-sort-order">Sort items by</label>
     *   <select id="table-sort-order">
     *     <option selected="selected">Name</option>
     *   </select>
     *   <input type="submit" value="Sort items" />
     * </form>
     * <table table-pinned-columns>
     *   <tbody title="Category Title">
     *     <tr><td class="pinned">123</td><td class="pinned">456</td></tr>
     *     <tr><td>Foo</td><td>Bar</td></tr>
     *   </tbody>
     * </table>
     * </div>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('table', directive);

    directive.$inject = [];
    function directive() {

        return {
            restrict: 'E',
            link: link
        };

        function link(scope, element, attrs) {

            var parent = element.parent();
            var blits = []; // functions that update cell position

            var scrollEventWatcher;

            scope.$watch(function(){
                return element[0].querySelectorAll('.sticky:not(.stuck)').length;
            }, function(num){
                if(num > 0){
                    createBlitArray();
                }
                if(num > 0){
                    if(scrollEventWatcher){
                        parent.off('scroll');
                    }
                    scrollEventWatcher = parent.on('scroll', animate);
                }
            });

            function createBlitArray(){
                blits = [];
                var stuckElements = element[0].querySelectorAll('.stuck');
                angular.forEach(stuckElements, function(cell){
                    angular.element(cell).removeClass('stuck');
                });

                var pinnedCellsQuery = element[0].querySelectorAll('.sticky'); 
                angular.forEach(pinnedCellsQuery, function(cell) {
                    cell = angular.element(cell);
                    cell.addClass('stuck');

                    var cellOffset = cell.position().left;
                    var parentWidth = parent.width();
                    var tableWidth = element.width();

                    blits.push(function(offset){
                        var rightOffset = parentWidth + offset - tableWidth;
                        if(rightOffset > 0){
                            return;
                        }
                        if(cellOffset > parentWidth){ // if the column is far away on the right...
                            offset =  rightOffset;
                        }
                        
                        cell.css('left', offset + 'px');
                    });
                });

            }

            function animate(){
                angular.forEach(blits, function(blit){
                    var offset = 0 - element.position().left;
                    blit(offset);
                });
            }
        }
    }

})();
