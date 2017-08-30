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
     * @restrict EA
     * @name openlmis-form.directive:inputControl
     *
     * @description
     * Aggrigates all child input elements, and shows a single state for all
     * internal child elements. Overall this directive enforces consistent
     * layout and style between input elements and error messages (the using
     * openlmis-invalid).
     */
    
    angular
        .module('openlmis-form')
        .directive('inputControl', directive);

    function directive() {
        return {
            link: link,
            priority: 5,
            restrict: 'EA',
            controller: 'InputControlController'
        }
    }

    function link(scope, element, attrs) {
        catchFocus();
        watchDisabled();

        /**
         * @ngdoc method
         * @methodOf openlmis-form.directive:inputControl
         * @name catchFocus
         *
         * @description
         * If any child element gets focus, the is-focused class is added to
         * the input-control element.
         */
        function catchFocus(){
            element.on('focusin', function(){
                element.addClass('is-focused');
            });

            element.on('focusout', function(){
                element.removeClass('is-focused');
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-form.directive:inputControl
         * @name watchDisabled
         *
         * @description
         * When child elements change their disabled state, the input wrapper
         * does too. Only if all child inputs are disabled will the
         * input-control get the class 'is-disabled'
         */
        function watchDisabled() {
            scope.$watchCollection(function(){
                var inputElements = element.find('[name]').length,
                    disabledInputElements = element.find('[name]:disabled').length;
                return inputElements === disabledInputElements;
            }, function(isDisabled){
                if(isDisabled){
                    element.addClass('is-disabled');
                } else {
                    element.removeClass('is-disabled');
                }
            });
        }
    }
        
})();