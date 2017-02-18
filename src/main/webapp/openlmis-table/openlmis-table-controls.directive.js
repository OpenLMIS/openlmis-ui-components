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
