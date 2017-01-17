(function(){
    'use strict';
    /**
     *
     * @ngdoc service
     * @name order-pod-view.podFactory
     *
     * @description
     * Alows the user to retrieve proofs of deliveries.
     */
    angular
        .module('order-pod-view')
        .factory('podFactory', factory);

    factory.$inject = ['$q', 'POD', 'podService', 'orderFactory'];

    function factory($q, POD, podService, orderFactory){

        return {
            get: get
        };


        /**
         * @ngdoc function
         * @name get
         * @methodOf order-pod-view.podFactory
         *
         * @description
         * Retrieves proof of deliery by given UUID.
         *
         * @param {String} podId POD UUID
         * @return {Promise} POD
         */
        function get(podId) {
            var deferred = $q.defer();

            podService.get(podId).then(function(pod) {
                orderFactory.get(pod.order).then(function(order) {
                    deferred.resolve(new POD(pod, order));
                }, function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }
    }

})();
