(function() {

    'use strict';

    /**
     *
     * @ngdoc service
     * @name proof-of-delivery-view.podFactory
     *
     * @description
     * Alows the user to retrieve proofs of deliveries.
     */
    angular
        .module('proof-of-delivery-view')
        .factory('podFactory', factory);

    factory.$inject = ['$q', 'ProofOfDelivery', 'podService'];

    function factory($q, ProofOfDelivery, podService){

        /**
         * @ngdoc function
         * @name get
         * @methodOf proof-of-delivery-view.podFactory
         *
         * @description
         * Retrieves proof of deliery by given UUID.
         *
         * @param {String} podId Proof of Delivery UUID
         * @return {Promise} ProofOfDelivery
         */
        function get(podId) {
            var deferred = $q.defer();

            podService.get(podId).then(function(pod) {
                deferred.resolve(new ProofOfDelivery(pod));
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        return {
            get: get
        };
    }

})();
