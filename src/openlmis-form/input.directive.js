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
     * @name openlmis-form.directive:input
     *
     * @description
     * Sets id and name attributes, if not already set. This is done to allow
     * angular's formControl.$error dictionary to work correctly with 'vanilla'
     * HTML inputs written in the OpenLMIS-UI.
     *
     * It's important to set an input element's ID for ARIA features to work
     * correctly.
     *
     * This runs on all input, select, and textarea elements.
     */
    
    angular
        .module('openlmis-form')
        .directive('input', directive)
        .directive('select', directive)
        .directive('textarea', directive);

    directive.$inject = ['uniqueIdService'];
    function directive(uniqueIdService) {
        return {
            compile: function(element, attrs){
                setup(element, attrs);
                return {};
            },
            restrict: 'E'
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-form.directive:input
         * @name setup
         *
         * @description
         * Checks if the element's ID is set, and if not gets a unique id from
         * the uniqueIdService.
         *
         * The element's id is then used to make the element's name attribute —
         * unless the ng-model attribute is set.
         */
        function setup(element, attrs) {
            // set unique ID (if not set)
            if(!element.attr('id') || element.attr('id') == ""){
                element.attr('id', uniqueIdService.generate());
            }

            if(!element.attr('name') || element.attr('name') == ""){
                if(attrs.ngModel) {
                    element.attr('name', attrs.ngModel);
                } else {
                    element.attr('name', "input-" + element.attr('id'));
                }
            }
        }
    }

})();