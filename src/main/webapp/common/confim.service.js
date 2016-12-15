(function(){
    "use strict";

    /**
     *
     * @ngdoc service
     * @name openlmis-core.Confirm
     * @description
     * Service allows to display confirm modal with custom message.
     *
     */

    angular.module('openlmis-core')
        .service('Confirm', Confirm);

    Confirm.$inject = ['bootbox', 'messageService', '$q'];

    function Confirm(bootbox, messageService, $q) {

        var Confirm = confirm;
        Confirm.destroy = destroy

        return Confirm;

        /**
         *
         * @ngdoc function
         * @name Confirm
         * @methodOf openlmis-core.Confirm
         * @param {String} message Primary message to display at the top
         * @param {Function} additionalMessage Additional message to display below
         * @param {String} buttonMessage Optional message to display on confirm button
         *
         * @description
         * Shows confirm modal with custom message.
         *
         */
        function confirm(message, buttonMessage) {
            return makeModal(false, message, buttonMessage);
        }

        /**
         *
         * @ngdoc function
         * @name destroy
         * @methodOf openlmis-core.Confirm
         * @param {String} message Message to display
         * @return {Promise} confirm promise
         *
         * @description
         * Shows confirm modal with custom message and returns a promise.
         *
         */
        function destroy(message) {
            return makeModal(true, message);
        }

        function makeModal(remove, message, buttonMessage) {
            var deferred = $q.defer();
            bootbox.dialog({
                message: messageService.get(message),
                buttons: {
                    cancel: {
                        label: messageService.get('msg.button.cancel'),
                        callback: deferred.reject,
                    },
                    success: {
                        label: messageService.get(buttonMessage ? buttonMessage : 'msg.button.ok'),
                        callback: deferred.resolve,
                        className: remove ? "btn-danger" : "btn-primary",
                    }
                }
            });
            return deferred.promise;
        }
    }
})();
