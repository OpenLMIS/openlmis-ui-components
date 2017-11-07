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
     * @name openlmis-table.directive:openlmisTablePaneCellFocusable
     *
     * @description
     * Keeps table cells within the visible area of the table pane.
     */
    angular.module('openlmis-table')
    .directive('openlmisTablePaneCellFocusable', directive);

    directive.$inject = ['$timeout'];

    function directive($timeout) {
        var directive = {
            restrict: 'A',
            require: '^^openlmisTablePane',
            link: link
        }
        return directive;

        function link(scope, element, attrs, tablePaneCtrl) {
            var visibilityTimeout;

            element.on('focus focusin', checkVisibility);
            element.on('blur focusout', cancelVisibility);
            scope.$on('$destroy', function() {
                element.off('focus focusin', checkVisibility);
                element.off('blur focusout', cancelVisibility);
            });

            function checkVisibility() {
                if(attrs.hasOwnProperty('openlmisStickyColumn')) {
                    return;
                }

                cancelVisibility();
                visibilityTimeout = $timeout(function() {
                    visibilityTimeout = undefined;

                    var viewport = tablePaneCtrl.getViewportRectangle(),
                        leftBound = viewport.left + viewport.paddingLeft,
                        rightBound = viewport.left + viewport.width - viewport.paddingRight - viewport.paddingLeft,
                        cellPosition = element.position(),
                        cellWidth = element.width(),
                        isNotVisibleLeft = (leftBound >= cellPosition.left),
                        isNotVisibleRight = (rightBound <= cellPosition.left + cellWidth);

                    if(isNotVisibleLeft || isNotVisibleRight) {
                        tablePaneCtrl.setScrollLeft(cellPosition.left - viewport.paddingLeft);
                    }
                }, 500);
            }

            function cancelVisibility() {
                if(visibilityTimeout) {
                    $timeout.cancel(visibilityTimeout);
                    visibilityTimeout = undefined;
                }
            }
        }
    }

})();