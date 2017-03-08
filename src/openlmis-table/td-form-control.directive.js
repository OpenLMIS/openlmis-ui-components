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
     * @name openlmis-table.directive:tdFormControl
     *
     * @description
     * Adds form-control class to table cells that include only a single input,
     * and will map that inputs state to the table cell.
     *
     * @example
     *
     * ```
     * <table>
     *   <tbody>
     *     <tr>
     *         <td>
     *             <label>123</label>
     *             <input type="text" />
     *         </td>
     *     </tr>
     *   </tbody>
     * </table>
     * ```
     * Which will produce the following markup
     * ```
     * <table>
     *   <tbody>
     *     <tr>
     *         <td class="form-control">
     *             <label>123</label>
     *             <input type="text" />
     *         </td>
     *     </tr>
     *   </tbody>
     * </table>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('td', tdFormControl);

    tdFormControl.$inject = ['$compile'];
    function tdFormControl($compile) {
        return {
            restrict: 'E',
            replace: false,
            link: link
        };

        function link(scope, element, attrs) {
            var inputElement = element.children('input[type="text"], input[type="number"], input[type="password"], select');
            if(inputElement.length == 1){
                element.addClass('form-control');

                inputElement.on('focus', function(){
                    element.addClass('is-focused');
                });
                inputElement.on('blur', function(){
                    element.removeClass('is-focused');
                });

                scope.$watch(function(){
                    return inputElement.prop('disabled');
                }, function(disabled){
                    if(disabled){
                        element.addClass('is-disabled');
                    } else {
                        element.removeClass('is-disabled');
                    }
                });
            }
        }
    }

})();
