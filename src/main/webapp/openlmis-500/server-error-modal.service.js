(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-500.serverErrorModalService
     *
     * @description
     * Allows application to display only one server error modal at once.
     */
    angular
        .module('openlmis-500')
        .service('serverErrorModalService', service);

    service.$inject = ['$injector']

    function service($injector) {

        var canDisplayModal = true;

        this.displayAlert = displayAlert;

        /**
         *
         * @ngdoc function
         * @name  displayAlert
         * @methodOf openlmis-500.serverErrorModalService
         *
         * @param  {String} message Message to display in modal
         *
         * @description
         * Displays modal with given message if there is no other error modal shown.
         *
         */
        function displayAlert(message) {
            if(canDisplayModal) {
                $injector.get('alertService').error(message, closeModal);
                canDisplayModal = false;
            }
        }

        function closeModal() {
            canDisplayModal = true;
        }
    }

})();
