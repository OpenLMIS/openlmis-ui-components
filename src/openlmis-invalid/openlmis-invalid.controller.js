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
            isHidden = false,
            isSuppressed = false;

        vm.getMessages = getMessages;
        vm.setMessages = setMessages;
        vm.resetMessages = resetMessages;
        vm.parseMessage = parseMessage;

        vm.isSuppressed = areMessagesSuppressed;
        vm.suppress = suppress;
        vm.unsuppress = unsuppress; 

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
            var messagesToReturn = {};
            childControllers.forEach(function(child){
                angular.extend(messagesToReturn, child.getMessages());
            });

            angular.extend(messagesToReturn, messages);

            return messagesToReturn;
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
                    newMessages[key] = vm.parseMessage(key);
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

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name isSuppressed
         *
         * @returns {Boolean} If messages are suppressed
         *
         * @description
         * Returns if the controllers messages are suppressed
         */
        function areMessagesSuppressed() {
            return isSuppressed;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name suppress
         *
         * @description
         * Suppresses messages so they are not shown, regardless if they are
         * shown or hidden.
         */
        function suppress() {
            isSuppressed = true;

            childControllers.forEach(function(child){
                child.suppress();
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name unsuppress
         *
         * @description
         * Unsuppresses messages so that they are shown normally.
         */
        function unsuppress() {
            isSuppressed = false;

            childControllers.forEach(function(child){
                child.unsuppress();
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name messagesHidden
         *
         * @returns {Boolean} If messages should not be shown
         *
         * @description
         * Returns a boolean indicating if messages are true or false. If
         * messages are suppressed, it will return true.
         */
        function messagesHidden() {
            if(isSuppressed) {
                return true;
            }

            return isHidden;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name show
         *
         * @description
         * Shows messages, and recursively shows all child elements.
         */
        function showMessages() {
            isHidden = false;

            childControllers.forEach(function(child){
                child.show();
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name hide
         *
         * @description
         * Hides messages, and the messages of all child elements.
         */
        function hideMessages() {
            isHidden = true;

            childControllers.forEach(function(child){
                child.hide();
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name registerController
         *
         * @param {Object} child An openlmis-invalid controller instance.
         *
         * @description
         * Registers a child controller, and changes the child's hidden and
         * suppressed states to match the parents.
         */
        function registerInvalidController(child) {
            childControllers.push(child);

            if(vm.isHidden()) {
                child.hide();
            } else {
                child.show();
            }

            if(vm.isSuppressed()){
                child.suppress();
            } else {
                child.unsuppress();
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.controller:openlmisInvalidController
         * @name getChildControllers
         *
         * @returns {Array} A list of child openlmis-invalid controllers.
         *
         * @description
         * Returns an array of the controller's child controllers. If there
         * are no child controllers, an empty array is returned. 
         */
        function getChildControllers() {
            return childControllers;
        }

    }
        
})();