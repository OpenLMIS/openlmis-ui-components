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
     *
     * @ngdoc service
     * @name openlmis-modal.confirmService
     * @description
     * Service allows to display confirm modal with custom message.
     *
     */

    angular.module('openlmis-modal')
        .service('confirmService', confirmService);

    confirmService.$inject = ['bootbox', 'messageService', '$q'];

    function confirmService(bootbox, messageService, $q) {

        this.confirm = confirm;
        this.confirmDestroy = destroy;

        /**
         *
         * @ngdoc function
         * @name confirm
         * @methodOf openlmis-modal.confirmService
         * @param {String} message Primary message to display at the top
         * @param {Function} additionalMessage Additional message to display below
         * @param {String} buttonMessage Optional message to display on confirm button
         *
         * @description
         * Shows confirm modal with custom message.
         *
         */
        function confirm(message, buttonMessage) {
            return makeModal(false, message, buttonMessage);
        }

        /**
         *
         * @ngdoc function
         * @name destroy
         * @methodOf openlmis-modal.confirmService
         * @param {String} message Message to display
         * @param {String} buttonMessage Optional message to display on confirm button
         * @return {Promise} confirm promise
         *
         * @description
         * Shows confirm modal with custom message and returns a promise.
         *
         */
        function destroy(message, buttonMessage) {
            return makeModal(true, message, buttonMessage);
        }

        function makeModal(remove, message, buttonMessage) {
            var deferred = $q.defer();
            bootbox.dialog({
                message: messageService.get(message),
                buttons: {
                    cancel: {
                        label: messageService.get('msg.button.cancel'),
                        callback: deferred.reject
                    },
                    success: {
                        label: messageService.get(buttonMessage ? buttonMessage : 'msg.button.ok'),
                        callback: deferred.resolve,
                        className: remove ? "danger" : "primary"
                    }
                }
            });
            return deferred.promise;
        }
    }
})();
