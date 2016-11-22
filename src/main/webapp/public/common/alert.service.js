(function(){
    "use strict";

    /**
     *
     * @ngdoc service
     * @name openlmis-core.Alert
     * @description
     * Service allows to display alert modal with custom message.
     *
     */

    angular.module('openlmis-core')
        .service('Alert', Alert);

    Alert.$inject = ['$timeout', '$q', '$rootScope', '$compile', '$templateRequest', '$templateCache', 'bootbox', 'messageService'];

    function Alert($timeout, $q, $rootScope, $compile, $templateRequest, $templateCache, bootbox, messageService) {

        var alert = warning;
        alert.error = error;

        return alert;

        /**
         *
         * @ngdoc function
         * @name Alert
         * @methodOf openlmis-core.Alert
         * @param {String} message Primary message to display at the top
         * @param {String} additionalMessage Additional message to display below
         * @return {Promise} alert promise
         *
         * @description
         * Shows warning modal with custom message and returns promise.
         *
         */
        function warning(message, additionalMessage) {
            var deferred = $q.defer();
            showAlert('glyphicon-alert', deferred.resolve, message, additionalMessage);
            return deferred.promise;
        }

        /**
         *
         * @ngdoc function
         * @name error
         * @methodOf openlmis-core.Alert
         * @param {String} message Message to display
         * @param {String} callback Function called after closing alert
         *
         * @description
         * Shows alert modal with custom message and calls callback after closing alert.
         *
         */
        function error(message, callback) {
            showAlert('glyphicon-remove-circle', callback, messageService.get(message));
        }

        function showAlert(alertClass, callback, message, additionalMessage) {

            var templateURL = 'common/alert.html',
                template = $templateCache.get(templateURL);

            if (template){
                makeAlert(template);
            } else {
                $templateRequest(templateURL).then(makeAlert);
            }

            function makeAlert(html) {

                var modal,
                    scope = $rootScope.$new();

                scope.icon = alertClass;
                scope.message = messageService.get(message);
                if (additionalMessage) scope.additionalMessage = messageService.get(additionalMessage);

                modal = bootbox.dialog({
                    message: $compile(html)(scope),
                    callback: callback,
                    backdrop: true,
                    onEscape: callback ? callback : true,
                    closeButton: false,
                    className: 'alert-modal'
                });
                modal.on('click.bs.modal', function(){
                    if(callback) callback();
                    modal.modal('hide');
                });
                modal.on('hidden.bs.modal', function(){
                    angular.element(document.querySelector('.alert-modal')).remove();
                });
            }

        }


    }
})();
