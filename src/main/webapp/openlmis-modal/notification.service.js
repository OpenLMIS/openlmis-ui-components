(function(){
    "use strict";

    /**
     *
     * @ngdoc service
     * @name openlmis-modal.notificationService
     * @description
     * Service allows to display info/error/success notification element that expires after short period with custom message.
     *
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
        this.success = success
        this.error = error;

        /**
         *
         * @ngdoc function
         * @name success
         * @methodOf openlmis-modal.notificationService
         * @param {String} successMessage success message to display
         *
         * @description
         * Shows success message element with custom message and return promise.
         *
         */
        function success(successMessage) {
            return showMessage(successMessage, 'alert-success', 'glyphicon-ok-sign');
        }

        /**
         *
         * @ngdoc function
         * @name error
         * @methodOf openlmis-modal.notificationService
         * @param {String} errorMessage info message to display
         *
         * @description
         * Shows error message element with custom message and return promise.
         *
         */
        function error(errorMessage) {
            return showMessage(errorMessage, 'alert-danger', 'glyphicon-remove-sign');
        }

        /**
         *
         * @ngdoc function
         * @name info
         * @methodOf openlmis-modal.notificationService
         * @param {String} infoMessage info message to display
         *
         * @description
         * Shows info message element with custom message and return promise.
         *
         *
         */
        function info(infoMessage) {
            return showMessage(infoMessage, 'alert-info', 'glyphicon-info-sign');
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
                    element.remove();
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
