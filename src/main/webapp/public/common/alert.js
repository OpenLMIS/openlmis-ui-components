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

    Alert.$inject = ['$timeout', '$q', 'bootbox', 'messageService'];

    function Alert($timeout, $q, bootbox, messageService) {

        /**
         *
         * @ngdoc function
         * @name error
         * @methodOf openlmis-core.Alert
         * @param {String} message primary message to display at the top
         * @param {String} additionalMessage additional message to display below
         * @return {Promise} alert promise
         * 
         * @description
         * Shows alert modal with custom message and returns promise.
         *
         */
        function error(message, additionalMessage) {
            var deferred = $q.defer();
            if(additionalMessage) showAlert(messageService.get(additionalMessage), messageService.get(message), deferred.resolve);
            else showAlert(message, null, deferred.resolve);
            return deferred.promise;
        }

        /**
         *
         * @ngdoc function
         * @name errorWithCallback
         * @methodOf openlmis-core.Alert
         * @param {String} message message to display
         * @param {String} callback function called after closing alert
         * 
         * @description
         * Shows alert modal with custom message and calls callback after closing alert.
         *
         */
        function errorWithCallback(message, callback) {
            showAlert(messageService.get(message), null, callback);
        }

        function showAlert(message, title, callback) {
            bootbox.alert({
                message: message,
                title: title,
                callback: callback
            });
        }

        return {
            error: error,
            errorWithCallback: errorWithCallback
        }
    }
})();