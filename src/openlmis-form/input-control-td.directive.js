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
     * @name openlmis-form.directive:inputControlTD
     *
     * @description
     * Adds input-control class to table cells that include only a single input,
     * and will map that inputs state to the table cell.
     */
    angular
        .module('openlmis-form')
        .directive('td', tdFormControl);

    tdFormControl.$inject = ['$compile'];
    function tdFormControl($compile) {
        return {
            restrict: 'E',
            replace: false,
            priority: 30,
            compile: function(element, attrs){
                return {
                    pre: compile
                };
            }
        };

        function compile(scope, element, attrs) {
            if(element[0].hasAttribute('input-control')){
                // this stops an infinite loop
                return ;
            }

            if(element.parents('[input-control]').length > 0){
                return ;
            }

            var inputElement = element.children('input, select, textarea');
            if(inputElement.length == 1) {
                element.attr('input-control', '');

                if(!element[0].hasAttribute('openlmis-invalid')){
                    element.attr('openlmis-invalid', '');
                }

                var newElement = $compile(element.clone())(scope);
                element.replaceWith(newElement);
            }
        }
    }

})();
