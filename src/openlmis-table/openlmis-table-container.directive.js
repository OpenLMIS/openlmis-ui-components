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
     * Checks if there is a single table element with in the container, if so the contents are arranged to meet our custom layout.
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
            link: link,
            restrict: 'C',
            priority: 10
        };
        return directive;
    }

    function link(scope, element) {
        if (element.children('table').length == 1) {
            var toolbar = angular.element('<div class="toolbar"></div>'),
                main = angular.element('<div class="row"></div>');

            element.children().each(function(index, childElement){
                if(['TABLE', 'FORM', 'OPENLMIS-PAGINATION'].indexOf(childElement.nodeName) === -1){
                    toolbar.append(childElement);
                } else if(childElement.nodeName == 'FORM'){
                    main.append(childElement);
                }
            });

            var table = element.children('table')
            table.appendTo(main).wrap('<div class="main"><div class="openlmis-flex-table"></div></div>');
            table.parent().after(element.children('openlmis-pagination'));

            element.append(toolbar)
            .append(main);
        }
    }

})();
