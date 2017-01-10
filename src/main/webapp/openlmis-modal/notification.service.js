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

        var container, notify;

        if(!container) createContainer();

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
            var templateURL = 'openlmis-modal/notification.html',
                template = $templateCache.get(templateURL);

            if (template) makeNotification(template);
            else $templateRequest(templateURL).then(makeNotification);

            function makeNotification(html) {
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

                element = $compile(html)(scope);
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

                function cancelTimeout() {
                    if(timeoutPromise){
                        $timeout.cancel(timeoutPromise);
                    }
                }

                function closeNotification() {
                    element.addClass('hide-notification');
                    element.bind('webkitAnimationEnd',function(){
                        element.remove();
                    });
                    cancelTimeout();
                }

            }
        }

        function createContainer() {
            var templateURL = 'openlmis-modal/notification-container.html',
                template = $templateCache.get(templateURL);

            if (template){
                makeContainer(template);
            } else {
                $templateRequest(templateURL).then(makeContainer);
            }

            function makeContainer(html) {
                container = angular.element(html);
                angular.element(document.body).append(container);
            }
        }

    }
})();
