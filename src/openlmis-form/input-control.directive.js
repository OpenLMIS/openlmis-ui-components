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
            restrict: 'EA',
            controller: 'InputControlController',
            require: [
                'inputControl',
                '?openlmisInvalid'
            ]
        }
    }

    function link(scope, element, attrs, ctrls) {
        var inputCtrl = ctrls[0],
            openlmisInvalidCtrl = ctrls[1];


        watchErrors();
        surpressInputErrors();
        moveInvalidMessages();
        catchFocus();
        watchDisabled();


        /**
         * @ngdoc method
         * @methodOf openlmis-form.directive:inputControl
         * @name watchErrors
         *
         * @description
         * Sets up watcher to look for error changes in inputCtrl. When there
         * are errors, the `is-invalid` class is added to the element.
         *
         * If openlmisInvalid is also set on the element, the error message
         * object is passed to openlmisInvalid.
         */
        function watchErrors(){
            scope.$watchCollection(inputCtrl.getErrors, updateErrors);
            scope.$watchCollection(function(){
                return element.parents('[openlmis-invalid-hidden]');
            }, updateErrors);
        }

        function updateErrors(){
            var messages = inputCtrl.getErrors();
            if(openlmisInvalidCtrl){
                openlmisInvalidCtrl.setMessages(messages);
            }

            if(!hasErrorsSurpressed() && Object.keys(messages).length > 0){
                element.addClass('is-invalid');
            } else {
                element.removeClass('is-invalid');
            }
        }

        function hasErrorsSurpressed() {
            return element.parents('[openlmis-invalid-hidden]').length > 0;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-form.directive:inputControl
         * @name surpressInputErrors
         *
         * @description
         * Any inputs with a name attribute (which should be all of them), then
         * openlmis-invalid-hidden is set on each element.
         */
        function surpressInputErrors(){
            scope.$watchCollection(function(){
                return element.find('[name]');
            }, function(inputs){
                if(openlmisInvalidCtrl){
                    inputs.attr('openlmis-invalid-hidden', true);
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-form.directive:inputControl
         * @name moveInvalidMessages
         *
         * @description
         * The OpenlmisInvalid directive appends invalid messages, which
         * wouldn't work with the input-control directive. So, if an invalid
         * message element is added, it is moved to after the input-control.
         */
        function moveInvalidMessages() {
            scope.$watchCollection(function(){
                return element.children('.openlmis-invalid');
            }, function(invalidElements){
                if(element.prop('tagName') === 'FIELDSET' && element.children('legend').length > 0) {
                    element.children('legend').after(invalidElements);
                } else if(element.parents('.form-inline').length > 0) {
                    invalidElements.remove();
                } else {
                    element.after(invalidElements);
                }
            });
        }

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