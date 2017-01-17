(function(){
    'use strict';
    /**
     *
     * @ngdoc service
     * @name order.orderFactory
     *
     * @description
     * Alows the user to retrieve orders.
     */
    angular
        .module('order')
        .factory('orderFactory', factory);

    factory.$inject = ['$q', 'Order', 'programService', 'facilityService', 'periodService'];

    function factory($q, Order, programService, facilityService, periodService){

        return {
            getById: getById,
            get: get
        };

        /**
         * @ngdoc function
         * @name getById
         * @methodOf order.orderFactory
         *
         * @description
         * Builds Order with full info firstly getting it from server by id.
         *
         * @param {String} orderId Order UUID
         * @return {Promise} Order
         */
        function getById(orderId) {
            var deferred = $q.defer();

            orderService.get(orderId).then(function(source) {
                get(source).then(function(order) {
                    deferred.resolve(modifiedOrder);
                }, function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name get
         * @methodOf order.orderFactory
         *
         * @description
         * Builds Order with full info.
         *
         * @param {String} source Order object
         * @return {Promise} Order
         */
        function get(source) {
            var deferred = $q.defer();

            $q.all([
                facilityService.get(source.facilityId),
                facilityService.get(source.requestingFacilityId),
                facilityService.get(source.receivingFacilityId),
                facilityService.get(source.supplyingFacilityId),
                programService.get(source.programId),
                periodService.get(source.processingPeriodId)
            ]).then(function(results) {
                deferred.resolve(new Order(source, results[0], results[1], results[2], results[3], results[4], results[5]));
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }
    }

})();
