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
     * @name openlmis-form.directive:openlmisDatepickerCompile
     *
     * @description
     * Replaces the default HTML5 datepicker with OpenLMIS custom one.
     *
     * @example
     * ```
     * <input type="date"/>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('input', openlmisDatepickerCompile);

    openlmisDatepickerCompile.$inject = ['$compile'];

    function openlmisDatepickerCompile($compile) {
        var PRIORITY = 200;

        return {
            restrict: 'E',
            compile: compile,
            priority: PRIORITY,
            terminal: true
        };

        function compile(element) {
            if (element.attr('type') === 'date') {
                var input = angular.element(element[0]);
                input.attr('type', 'text');
                input.attr('openlmis-datepicker', 'openlmis-datepicker');

                element.replaceWith(input);
            }

            return link;
        }

        function link(scope, element) {
            $compile(element, null, PRIORITY)(scope);
        }
    }
})();

