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

        var template = $templateCache.get('openlmis-modal/alert.html');

        this.warning = warning;
        this.error = error;
        this.success = success;

        /**
         *
         * @ngdoc function
         * @name warning
         * @methodOf openlmis-modal.alertService
         *
         * @description
         * Shows warning modal with custom message and returns promise.
         *
         * @param {String} message Primary message to display at the top
         * @param {String} additionalMessage Additional message to display below
         * @return {Promise} alert promise
         */
        function warning(message, additionalMessage) {
            return showAlert('glyphicon-alert', message, additionalMessage);
        }

        /**
         * @ngdoc function
         * @name error
         * @methodOf openlmis-modal.alertService
         *
         * @description
         * Shows alert modal with custom message and calls callback after closing alert.
         *
         * @param {String} message Message to display
         */
        function error(message) {
            return showAlert('glyphicon-remove-circle', message);
        }

        /**
         * @ngdoc function
         * @name success
         * @methodOf openlmis-modal.alertService
         *
         * @description
         * Shows success modal with custom message and calls callback after closing alert.
         *
         * @param {String} message Message to display
         * @param {String} additionalMessage Additional message to display below
         */
        function success(message, additionalMessage) {
            return showAlert('glyphicon-ok-circle', message, additionalMessage);
        }

        function showAlert(alertClass, message, additionalMessage) {
            var modal,
                deferred = $q.defer(),
                scope = $rootScope.$new();

            scope.icon = alertClass;
            scope.message = message;
            scope.additionalMessage = additionalMessage;

            modal = bootbox.dialog({
                message: $compile(template)(scope),
                callback: cleanUp,
                backdrop: true,
                onEscape: cleanUp,
                closeButton: false,
                className: 'alert-modal'
            });

            return deferred.promise;

            function cleanUp() {
                deferred.resolve();
                modal.modal('hide');
                modal = undefined;
                scope.$destroy();
            }
        }


    }
})();
