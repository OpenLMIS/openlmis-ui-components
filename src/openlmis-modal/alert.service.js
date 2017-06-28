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

(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-modal.alertService
     *
     * @description
     * Service allows to display alert modal with custom message.
     */
    angular
        .module('openlmis-modal')
        .service('alertService', alertService);

    alertService.$inject = [
        '$q', 'openlmisModalService'
    ];

    function alertService($q, openlmisModalService) {

        var modal;

        this.warning = warning;
        this.error = error;
        this.success = success;

        /**
         * @ngdoc method
         * @name warning
         * @methodOf openlmis-modal.alertService
         *
         * @description
         * Shows warning modal with custom message and returns promise.
         *
         * @param   {String}    title   the title of the alert
         * @param   {String}    message the detailed message to be shown within the alert modal
         * @return  {Promise}           the alert promise, if any other alert is already show this
         *                              promise will be automatically rejected
         */
        function warning(title, message) {
            return showAlert('warning', title, message);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.alertService
         * @name error
         *
         * @description
         * Shows alert modal with custom message and calls callback after closing alert.
         *
         * @param   {String}    title   the title of the alert
         * @param   {String}    message the detailed message to be shown within the alert modal
         * @return  {Promise}           the alert promise, if any other alert is already show this
         *                              promise will be automatically rejected
         */
        function error(title, message) {
            return showAlert('error', title, message);
        }

        /**
         * @ngdoc method
         * @name success
         * @methodOf openlmis-modal.alertService
         *
         * @description
         * Shows success modal with custom message and calls callback after closing alert.
         *
         * @param   {String}    title   the title of the alert
         * @param   {String}    message the detailed message to be shown within the alert modal
         * @return  {Promise}           the alert promise, if any other alert is already show this
         *                              promise will be automatically rejected
         */
        function success(title, message) {
            return showAlert('success', title, message);
        }

        function showAlert(alertClass, title, message) {
            if (modal) return $q.reject();

            modal = openlmisModalService.createDialog({
                controller: 'AlertModalController',
                controllerAs: 'vm',
                templateUrl: 'openlmis-modal/alert.html',
                show: true,
                resolve: {
                    alertClass: function() {
                        return alertClass;
                    },
                    title: function() {
                        return title;
                    },
                    message: function() {
                        return message;
                    }
                }
            });

            modal.promise.finally(function() {
                modal = undefined;
            });

            return modal.promise;
        }
    }
})();
