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
     * @name openlmis-form.directive:inputControlInvalidCompile
     *
     * @description
     * Makes sure that openlmis-invalid is applied to all instances of
     * inputController.
     */
    angular
        .module('openlmis-form')
        .directive('inputControl', directive);

    directive.$inject = ['$compile'];

    function directive($compile) {
        return {
            restrict: 'A',
            priority: 105,
            terminal: true,
            compile: compile
        };

        function compile(element, attrs) {

            if(!attrs.hasOwnProperty('openlmisInvalid')) {
                element.attr('openlmis-invalid', '');
            }
            
            return link;
        }

        function link(scope, element) {
            $compile(element, null, 105)(scope);
        }
    }

})();
