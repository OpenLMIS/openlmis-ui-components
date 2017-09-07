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
     * @name openlmis-table.directive:tdFocus
     *
     * @description
     * Makes sure the table cell element is focused.
     * 
     */
    
    angular
        .module('openlmis-table')
        .directive('table', directive);

    directive.$inject = ['$timeout']

    function directive($timeout) {
        return {
            link: link,
            restrict: 'E'
        };

        function link(scope, element, attrs) {
            if(!element.parents('.openlmis-table-container').length) {
                return;
            }

            element.on('focus focusin', 'td, th', checkVisibilityDeferred);

            var checkVisibilityTimeout;
            function checkVisibilityDeferred(event) {
                if(checkVisibilityTimeout) {
                    $timeout.cancel(checkVisibilityTimeout);
                }
                checkVisibilityTimeout = $timeout(function() {
                    checkVisibility(angular.element(event.target));
                }, 100);
            }

            function checkVisibility(tableCell) {
                if(tableCell.hasClass('stuck')){
                    return;
                }

                var leftPos = tableCell.position().left,
                    width = tableCell.outerWidth(),
                    visibleEdgeLeft = 0,
                    visibleEdgeRight = 0;

                if(attrs.leftEdge) {
                    visibleEdgeLeft = attrs.leftEdge;
                }
                if(attrs.rightEdge) {
                    visibleEdgeRight = attrs.rightEdge;
                }

                if(leftPos < visibleEdgeLeft) {
                    scrollTable(0);
                } else if(leftPos + width > visibleEdgeRight) {
                    scrollTable(leftPos);
                }
            }

            function scrollTable(pos) {
                element.parent()[0].scrollLeft = pos;
            }
        }

    }

})();
