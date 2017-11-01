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
     * Noop
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

        function link(scope, element, attrs, ctrls) {
            var cellCtrl = ctrls[0],
                tablePaneCtrl = ctrls[1],
                lastTransform,
                cancelAnimationFrame,
                originalUpdatePosition;

            tablePaneCtrl.registerStickyCell(cellCtrl);

            scope.$on('$destroy', function() {
                ctrl.removeStickyCell(cellCtrl);
            });

            cellCtrl.setup({
                stickLeft: attrs.hasOwnProperty('openlmisStickyColumn') && !attrs.hasOwnProperty('openlmisStickyColumnRight'),
                stickRight: attrs.hasOwnProperty('openlmisStickyColumn') && attrs.hasOwnProperty('openlmisStickyColumnRight'),
                stickTop: attrs.hasOwnProperty('openlmisStickyTop'),
                stickBottom: attrs.hasOwnProperty('openlmisStickyBottom')
            });

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