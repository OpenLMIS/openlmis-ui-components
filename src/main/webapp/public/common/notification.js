(function(){
    "use strict";

    /**
     * 
     * @ngdoc service
     * @name openlmis-core.Notification
     * @description
     * Service allows to display info/error/success notification element that expires after short period with custom message.
     *
     */

    angular.module('openlmis-core')
        .service('Notification', Notification);

    Notification.$inject = ['$rootScope', '$timeout', '$templateCache', '$templateRequest', '$compile', 'messageService'];

    function Notification($rootScope, $timeout, $templateCache, $templateRequest, $compile, messageService) {

        var container;

        if(!container) createContainer();

        function showMessage(message, type, icon) {
            var templateURL = 'common/notification.html',
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
                    if(timeoutCalled) element.remove();
                });

                container.append(element);

                setTimeout();

                function setTimeout() {
                    timeoutPromise = $timeout(function(){
                        timeoutCalled = true;
                        if(!isMouseOver) element.remove();
                        return false;
                    }, 5000);
                }

                function cancelTimeout() {
                    if(timeoutPromise){
                        $timeout.cancel(timeoutPromise);
                    }
                }

                function closeNotification() {
                    element.remove();
                    cancelTimeout();
                }

            }
        }

        function createContainer() {
            var templateURL = 'common/notification-container.html',
                template = $templateCache.get(templateURL);

            if (template){
                makeContainer(template);
            } else {
                $templateRequest(templateURL).then(makeContainer);
            }

            function makeContainer(html) {
                //var scope = $rootScope.$new();
                container = angular.element(html);
                angular.element(document.body).append(container);
            }
        }

        /**
         *
         * @ngdoc function
         * @name showSuccess
         * @methodOf openlmis-core.NotificationModal
         * @param {String} successMessage success message to display
         * @returns {Promise} success message promise
         * 
         * @description
         * Shows success message element with custom message and return promise.
         *
         */
        function showSuccess(successMessage) {
            return showMessage(successMessage, 'alert-success', 'glyphicon-ok-sign');
        }

        /**
         *
         * @ngdoc function
         * @name showError
         * @methodOf openlmis-core.NotificationModal
         * @param {String} errorMessage info message to display
         * @returns {Promise} error message promise
         * 
         * @description
         * Shows error message element with custom message and return promise.
         *
         */
        function showError(errorMessage) {
            return showMessage(errorMessage, 'alert-danger', 'glyphicon-remove-sign');
        }

        /**
         *
         * @ngdoc function
         * @name showInfo
         * @methodOf openlmis-core.NotificationModal
         * @param {String} infoMessage info message to display
         * @returns {Promise} info message promise
         * 
         * @description
         * Shows info message element with custom message and return promise.
         * 
         *
         */
        function showInfo(infoMessage) {
            return showMessage(infoMessage, 'alert-info', 'glyphicon-info-sign');
        }

        return {
            showSuccess: showSuccess,
            showError: showError,
            showInfo: showInfo
        }
    }
})();