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
     * @name openlmis-modal.controller:ConfirmModalController
     *
     * @description
     * Exposes data to the confirmation modal view.
     */
    angular
        .module('openlmis-modal')
        .controller('ConfirmModalController', controller);

    controller.$inject = [
        'className', 'message', 'confirmMessage', 'cancelMessage', 'confirmDeferred',
        'messageService', 'modalDeferred'
    ];

    function controller(className, message, confirmMessage, cancelMessage, confirmDeferred,
                        messageService, modalDeferred) {
        var vm = this;

        vm.$onInit = onInit;
        vm.confirm = confirm;
        vm.cancel = cancel;

        /**
         * @ngdoc property
         * @propertyOf openlmis-modal.controller:ConfirmModalController
         * @type {String}
         * @name className
         *
         * @description
         * The class of the confirmation button.
         */
        vm.className = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-modal.controller:ConfirmModalController
         * @type {String}
         * @name message
         *
         * @description
         * The message to be displayed on the confirmation modal.
         */
        vm.message = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-modal.controller:ConfirmModalController
         * @type {String}
         * @name confirmMessage
         *
         * @description
         * The message to be displayed on the confirmation button.
         */
        vm.confirmMessage = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-modal.controller:ConfirmModalController
         * @type {String}
         * @name cancelMessage
         *
         * @description
         * The message to be displayed on the cancel button.
         */
        vm.cancelMessage = undefined;

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.controller:ConfirmModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the ConfirmModalController.
         */
        function onInit() {
            vm.className = className;
            vm.message = retrieveMessage(message);
            vm.confirmMessage = confirmMessage;
            vm.cancelMessage = cancelMessage;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.controller:ConfirmModalController
         * @name confirm
         *
         * @description
         * Resolves the confirmation promise and closes the modal.
         */
        function confirm() {
            confirmDeferred.resolve();
            modalDeferred.resolve();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.controller:ConfirmModalController
         * @name cancel
         *
         * @description
         * Rejects the confirmation promise and closes the modal.
         */
        function cancel() {
            confirmDeferred.reject();
            modalDeferred.resolve();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.confirmService
         * @name retrieveMessage
         *
         * @description
         * Retrieves given message from messageService, replacing newlines with <br> to display
         * properly on the modal
         *
         * @param  {Object}  message  Message to display, either string or message-parameters
         *                            mapping.
         * @return {String}           Localized message
         */
        function retrieveMessage(message) {
            var localized;

            if (message.messageKey) {
                if (message.messageParams) {
                    localized = messageService.get(message.messageKey, message.messageParams);
                } else {
                    localized = messageService.get(message.messageKey);
                }
            } else {
                localized = messageService.get(message);
            }

            return localized.replace(/\n/g, '<br/>');
        }
    }

})();
