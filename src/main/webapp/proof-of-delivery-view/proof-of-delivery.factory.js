(function() {

    'use strict';

    /**
     *
     * @ngdoc service
     * @name proof-of-delivery-view.proofOfDeliveryFactory
     *
     * @description
     * Allows the user to retrieve proofs of deliveries.
     */
    angular
        .module('proof-of-delivery-view')
        .factory('proofOfDeliveryFactory', factory);

    factory.$inject = ['$q', 'ProofOfDelivery', 'proofOfDeliveryService'];

    function factory($q, ProofOfDelivery, proofOfDeliveryService){

        var factory = {
            get: get
        };

        return factory;

        /**
         * @ngdoc function
         * @name get
         * @methodOf proof-of-delivery-view.proofOfDeliveryFactory
         *
         * @description
         * Retrieves proof of delivery by given UUID.
         *
         * @param {String} podId Proof of Delivery UUID
         * @return {Promise} ProofOfDelivery
         */
        function get(podId) {
            var deferred = $q.defer();

            proofOfDeliveryService.get(podId).then(function(pod) {
                deferred.resolve(new ProofOfDelivery(pod));
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }
    }

})();
