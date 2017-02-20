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
