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
     * @name openlmis-table-form.directive:checkboxInputTd
     *
     * @description
     * Adds a label around a checkbox in a table cell, if one doesn't exist.
     */
    angular
        .module('openlmis-table-form')
        .directive('input', directive);

    function directive() {
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element) {
            if (validTarget(element)) {
                element.wrap('<label class="checkbox"></label>');
            }
        }

        /**
         * @ngdoc method
         * @restrict A
         * @name validTarget
         * @methodOf openlmis-table-form.directive:checkboxInputTd
         *
         * @description
         * Checks to see if a checkbox is a direct descendant of a table cell,
         * and if so returns true.
         */
        function validTarget(element) {
            var isCheckbox = element.attr('type') === 'checkbox',
                isChildOfTD = element.parent()[0].nodeName.toLowerCase() === 'td';

            return isCheckbox && isChildOfTD;
        }
    }

})();
