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
     * @ngdoc controller
     * @name openlmis-invalid.controller:openlmisInvalidController
     *
     * @description
     * Contains and renders list of error messages.
     */
    
    angular
        .module('openlmis-invalid')
        .controller('OpenlmisInvalidController', controller);

    controller.$inject = ['messageService']
    function controller(messageService) {
        var vm = this,
            messages = {},
            childControllers = [],
            isHidden = false;

        vm.getMessages = getMessages;
        vm.setMessages = setMessages;
        vm.resetMessages = resetMessages;

        vm.isHidden = messagesHidden;
        vm.show = showMessages;
        vm.hide = hideMessages;

        vm.registerController = registerInvalidController;
        vm.getChildren = getChildControllers;

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name  getMessages
         *
         * @description Gets an object of messages
         *
         * @returns {Object} Object of message keys and names
         */
        function getMessages() {
            return messages;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name setMessages
         *
         * @description
         * Sets the messages for the internal object, parsing any message
         * values that are a boolean with parseMessage
         */
        function setMessages(newMessages){
            Object.keys(newMessages).forEach(function(key) {
                if(typeof(newMessages[key]) == 'boolean') {
                    newMessages[key] = parseMessage(key);
                }
            });

            messages = newMessages;
        }

        function resetMessages() {
            messages = {};
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name parseMessages
         *
         * @description
         * Takes a message key, and will use the messageService to return a 
         * readable value.
         *
         * This method will first try to get specific openlmisInvalid. prefixed
         * version of the message.
         */
        function parseMessage(message) {
            var openlmisInvalidMessageKey = 'openlmisInvalid.' + message,
                openlmisInvalidMessage = messageService.get(openlmisInvalidMessageKey);
            if(openlmisInvalidMessage != openlmisInvalidMessageKey) {
                return openlmisInvalidMessage;
            } else {
                return messageService.get(message);
            }
        }


        function messagesHidden() {
            return isHidden;
        }

        function showMessages() {
            isHidden = false;

            childControllers.forEach(function(child){
                child.show();
            });
        }

        function hideMessages() {
            isHidden = true;

            childControllers.forEach(function(child){
                child.hide();
            });
        }

        function registerInvalidController(child) {
            childControllers.push(child);

            if(vm.isHidden()) {
                vm.hide();
            } else {
                vm.show();
            }
        }

        function getChildControllers() {
            return childControllers;
        }

    }
        
})();