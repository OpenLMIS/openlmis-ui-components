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
     * @name openlmis-modal.notificationService
     *
     * @description
     * Service allows to display info/error/success notification element that expires after short period with custom message.
     */
    angular.module('openlmis-modal')
        .service('notificationService', service);

    service.$inject = [
        '$rootScope', '$timeout', '$templateCache', '$templateRequest', '$compile', 'messageService'
    ];

    function service($rootScope, $timeout, $templateCache, $templateRequest, $compile,
                     messageService) {

        var container = createContainer(),
            template = $templateCache.get('openlmis-modal/notification.html');

        this.info = info;
        this.success = success;
        this.error = error;

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.notificationService
         * @name success
         *
         * @description
         * Shows success message element with custom message and return promise.
         *
         * @param {String} successMessage success message to display
         */
        function success(successMessage) {
            return showMessage(successMessage, 'is-success');
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.notificationService
         * @name error
         *
         * @description
         * Shows error message element with custom message and return promise.
         *
         * @param {String} errorMessage info message to display
         */
        function error(errorMessage) {
            return showMessage(errorMessage, 'is-error');
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.notificationService
         * @name info
         *
         * @description
         * Shows info message element with custom message and return promise.
         *
         * @param {String} infoMessage info message to display
         */
        function info(infoMessage) {
            return showMessage(infoMessage, 'is-info');
        }

        function showMessage(message, type, icon) {
            var notification,
                timeoutPromise,
                element,
                isMouseOver = false,
                timeoutCalled = false,
                scope = $rootScope.$new();

            scope.closeNotification = closeNotification;
            scope.message = messageService.get(message);
            scope.class = type;
            scope.glyphicon = icon;

            element = $compile(template)(scope);

            element.on('mouseover', function() {
                isMouseOver = true;
            });
            element.on('mouseout', function() {
                isMouseOver = false;
                if(timeoutCalled) closeNotification();
            });

            container.append(element);

            setTimeout();

            function setTimeout() {
                timeoutPromise = $timeout(function(){
                    timeoutCalled = true;
                    if(!isMouseOver) closeNotification();
                    return false;
                }, 5000);
            }

            function closeNotification() {
                element.addClass('hide-notification');
                element.bind('webkitAnimationEnd',function(){
                    if(element) element.remove();
                    scope.$destroy();
                    element = undefined;
                });

                if(timeoutPromise) {
                    $timeout.cancel(timeoutPromise);
                    timeoutPromise = undefined;
                }
            }
        }

        function createContainer() {
            var template = $templateCache.get('openlmis-modal/notification-container.html'),
                container = angular.element(template);

            angular.element(document.body).append(container);

            return container;
        }

    }
})();
