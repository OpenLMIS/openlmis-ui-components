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
     * @restrict A
     * @name openlmis-table.directive:openlmisTableStickyCell
     *
     * @description
     * Sticky table cells register themselves to the OpenLMIS table pane, and
     * adjust their position to always be visible in the table pane viewport.
     *
     * This directive registers the table cell's controller to the table pane,
     * then uses the CSS3 transform3d property to make animating elements
     * performant.
     */
    angular.module('openlmis-table')
    .directive('openlmisTableStickyCell', directive);

    directive.$inject = ['$$rAF'];

    function directive($$rAF) {
        var directive = {
            restrict: 'A',
            controller: 'OpenlmisTableStickyCellController',
            require: ['openlmisTableStickyCell', '^^openlmisTablePane'],
            link: link
        }
        return directive;

        /**
         * @ngdoc function
         * @name  link
         * @methodOf openlmis-table.directive:openlmisTableStickyCell
         *
         * @description
         * Sets up the openlmis sticky table cell control by reading attributes
         * from the directive element. Then registers the table cell controller
         * with the table pane controller.
         * 
         * @param  {Object} scope   Element scope
         * @param  {Object} element Element
         * @param  {Object} attrs   Object containing normalized element attributes
         * @param  {Array}  ctrls   List of controller objects passed to directive
         */
        function link(scope, element, attrs, ctrls) {
            var cellCtrl = ctrls[0],
                tablePaneCtrl = ctrls[1];

            cellCtrl.setup({
                stickLeft: attrs.hasOwnProperty('openlmisStickyColumn') && !attrs.hasOwnProperty('openlmisStickyColumnRight'),
                stickRight: attrs.hasOwnProperty('openlmisStickyColumn') && attrs.hasOwnProperty('openlmisStickyColumnRight'),
                stickTop: attrs.hasOwnProperty('openlmisStickyTop'),
                stickBottom: attrs.hasOwnProperty('openlmisStickyBottom')
            });

            modifyUpdatePositionForAnimation(cellCtrl, element);

            tablePaneCtrl.registerStickyCell(cellCtrl);
            scope.$on('$destroy', function() {
                ctrl.removeStickyCell(cellCtrl);
            });
        }

        /**
         * @ngdoc function
         * @name  modifyUpdatePositionForAnimation
         *
         * @description
         * Decorates the controller method for updating a table cell's position
         * by adding a function that is fired after the original function.
         *
         * This second function changes the new sticky cell's positions into a
         * CSS3 transform3d style, and then requests an animation frame where
         * the style change is applied (which prevents DOM thrashing).
         *
         * This method also keeps track of the last transformation applied to
         * the cell element, and if the position is the same, the element is
         * not updated.
         * 
         * @param  {Object} cellCtrl Sticky table cell controller
         * @param  {Object} element  Table cell element
         */
        function modifyUpdatePositionForAnimation(cellCtrl, element) {
            var lastTransform,
                cancelAnimationFrame,
                originalUpdatePosition = cellCtrl.updatePosition;

            cellCtrl.updatePosition = animatePosition;

            function animatePosition() {
                var positionObj = originalUpdatePosition.apply(cellCtrl, arguments),
                    transform = 'translate3d('+positionObj.left+'px, '+positionObj.top+'px, 0px)';

                if(transform === lastTransform) {
                    return;
                }

                lastTransform = transform;

                if(cancelAnimationFrame) {
                    cancelAnimationFrame();
                }

                cancelAnimationFrame = $$rAF(function() {
                    element[0].style.transform = transform;
                    cancelAnimationFrame = undefined;
                });
            }
        }
    }

})();