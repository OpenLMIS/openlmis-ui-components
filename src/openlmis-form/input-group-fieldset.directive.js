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
     * @name openlmis-form.directive:input-group
     *
     * @description
     * Checks if a fieldset contains elements of the same type, and if so turns
     * the fieldset into an input control.
     *
     * *NOTE:* This directive works at compile time, and will not detect any
     * dynamic changes once the element has been compiled.
     */

    angular
        .module('openlmis-form')
        .directive('fieldset', directive);

    directive.$inject = ['$compile'];
    function directive($compile) {
        return {
            compile: compile,
            priority: 100,
            restrict: 'E',
            terminal: true
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-form.directive:input-group
         * @name compile
         *
         * @param {Object} element Directive element
         *
         * @returns {Function} Linking function that compiles other directives
         * 
         * @description
         * If the element is a single type fieldset, it makes the fieldset an
         * input control and sets openlmis invalid
         */
        function compile(element, attrs) {
            if(isSingleTypeFieldset(element)) {
                if(!attrs.hasOwnProperty('inputControl')) {
                    element.attr('input-control', '');
                }

                if(!attrs.hasOwnProperty('openlmisInvalid')) {
                    element.attr('openlmis-invalid', '');
                }
            }

            return function(scope, element) {
                $compile(element, null, 100)(scope);
            };
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-form.directive:input-group
         * @name isSingleTypeFieldset
         *
         * @param {Object} fieldset The fieldset element to analyze.
         *
         * @returns {Boolean} True if there is only one type of input.
         * 
         * @description
         * Checks the inputs in a fieldset to make sure that the vaule set in
         * the ng-model or name attributes are the same.
         *
         * This method also returns false if there is any input type that is
         * not a radio button or checkbox.
         */
        function isSingleTypeFieldset(fieldset) {
            var type = false,
                name = false,
                matches = true;

            fieldset.find('[name],[ng-model]').each(function(index, element){
                var elementName = element['name'],
                    elementType = element['type'],
                    
                    supportedTypes = ['radio', 'checkbox'],
                    isSupportedType = supportedTypes.indexOf(elementType.toLowerCase()) > -1;
                

                if(element['ng-model']){
                    elementName = element['ng-model'];
                }

                if(!elementType || !elementName) {
                    return;
                }

                if(!type) {
                    type = elementType;
                }

                if(!name) {
                    name = elementName;
                }

                if(!matches || type != elementType || name != elementName || !isSupportedType) {
                    matches = false;
                }
            });

            return matches;
        }
    }

})();
