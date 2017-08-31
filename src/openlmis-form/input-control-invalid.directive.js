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
     * @name openlmis-form.directive:inputControlInvalid
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

    directive.$inject = ['messageService'];

    function directive(messageService) {
        return {
            link: link,
            priority: 5,
            restrict: 'EA',
            require: [
                'inputControl',
                'openlmisInvalid'
            ]
        };

       function link(scope, element, attrs, ctrls) {
            var inputCtrl = ctrls[0],
                openlmisInvalidCtrl = ctrls[1];

            watchErrors();
            moveInvalidMessages();

            var originalInvalidCtrlParseMessage = openlmisInvalidCtrl.parseMessage;
            openlmisInvalidCtrl.parseMessage = inputControlParseMessage;

            function inputControlParseMessage(message) {
                var messageKey = 'openlmisForm.' + message,
                    invalidMessage = messageService.get(messageKey);
                if(invalidMessage != messageKey) {
                    return invalidMessage;
                } else {
                    return originalInvalidCtrlParseMessage.apply(openlmisInvalidCtrl, arguments);
                }
            }

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
                scope.$watch(hasErrorsSurpressed, updateErrors);
            }

            function updateErrors(){
                var messages = inputCtrl.getErrors();
                openlmisInvalidCtrl.setMessages(messages);
            }

            function hasErrorsSurpressed() {
                return openlmisInvalidCtrl.isHidden();
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
                element.on('openlmisInvalid.show', showMessage);
            }

            function showMessage(event, messageElement) {
                if(!event.isDefaultPrevented()) {
                    event.preventDefault();

                    if(element.parents('.form-inline').length > 0) {
                        messageElement.remove();
                    } else {
                        element.after(messageElement);
                    }
                }
            }
        }
    }
        
})();