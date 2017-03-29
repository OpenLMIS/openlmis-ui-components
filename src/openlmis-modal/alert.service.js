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
    "use strict";

    /**
     * @ngdoc service
     * @name openlmis-modal.alertService
     *
     * @description
     * Service allows to display alert modal with custom message.
     */

    angular.module('openlmis-modal')
        .service('alertService', alertService);

    alertService.$inject = ['$timeout', '$q', '$rootScope', '$compile', '$templateRequest',
        '$templateCache', 'bootbox', 'messageService'
    ];

    function alertService($timeout, $q, $rootScope, $compile, $templateRequest, $templateCache,
        bootbox, messageService) {

        var template = $templateCache.get('openlmis-modal/alert.html'),
            deferred,
            modal,
            scope;

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
            if (modalIsDisplayed()) return $q.reject();

            deferred = $q.defer();
            scope = prepareScope(alertClass, title, message);

            modal = bootbox.dialog({
                message: $compile(template)(scope),
                callback: cleanUp,
                className: 'alert-modal',
                buttons: {
                    ok: {
                        label: messageService.get('msg.button.ok'),
                        className: 'alert-confirm',
                        callback: cleanUp
                    }
                }
            });

            return deferred.promise;
        }

        function prepareScope(alertClass, title, message) {
            var scope = $rootScope.$new();

            scope.alertClass = alertClass;
            scope.title = title;
            scope.message = message;

            return scope;
        }

        function cleanUp() {
            if (modal) {
                modal.modal('hide');
                modal = undefined;
            }

            if (deferred) {
                deferred.resolve();
                deferred = undefined;
            }

            if (scope) {
                scope.$destroy();
                scope = undefined;
            }
        }

        function modalIsDisplayed() {
            return modal || scope || deferred;
        }
    }
})();
