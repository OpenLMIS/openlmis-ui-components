(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name order.orderFactory
     *
     * @description
     * Manages orders and serves as an abstraction layer between orderService and controllers.
     */
    angular
        .module('order')
        .factory('orderFactory', factory);

    factory.$inject = ['orderService', '$q', 'ORDER_STATUS'];

    function factory(orderService, $q, ORDER_STATUS) {
        var factory = {
            search: search,
            getPod: getPod,
            searchOrdersForManagePod: searchOrdersForManagePod
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf order.orderFactory
         * @name search
         *
         * @description
         * Gets orders from the server using orderService and prepares them to be used in
         * controller.
         *
         * @param   {String}    supplyingFacilityId     (optional) the ID of the supplying facility
         * @param   {String}    requestingFacilityId    (optional) the ID of the requestingFacility
         * @param   {String}    programId               (optional) the ID of the program
         * @return  {Promise}                           the promise resolving to a list of all
         *                                              matching orders
         */
        function search(supplyingFacilityId, requestingFacilityId, programId) {
            return orderService.search({
                supplyingFacility: supplyingFacilityId,
                requestingFacility: requestingFacilityId,
                program: programId
            });
        }

        /**
         * @ngdoc method
         * @methodOf order.orderFactory
         * @name getPod
         *
         * @description
         * Gets pods for the given order.
         *
         * @param   {String}    orderId     (optional)  the ID of the given order
         * @return  {Promise}                           the promise resolving to a list of all PODs for the given order
         */
        function getPod(orderId) {
            return orderService.getPod(orderId);
        }

        /**
         * @ngdoc method
         * @methodOf order.orderFactory
         * @name searchOrdersForManagePod
         *
         * @description
         * Gets orders from the server using orderService and filter them by status
         *
         * @param   {String}    requestingFacilityId    (optional) the ID of the requestingFacility
         * @param   {String}    programId               (optional) the ID of the program
         * @return  {Promise}                           the promise resolving to a list of all
         *                                              matching orders
         */
        function searchOrdersForManagePod(requestingFacilityId, programId) {
            var deferred = $q.defer();

            orderService.search({
                requestingFacility: requestingFacilityId,
                program: programId,
                status: [
                    ORDER_STATUS.PICKED,
                    ORDER_STATUS.TRANSFER_FAILED,
                    ORDER_STATUS.READY_TO_PACK,
                    ORDER_STATUS.ORDERED,
                    ORDER_STATUS.RECEIVED
                ]
            }).then(function(orders) {
                deferred.resolve(orders);
            });
            return deferred.promise;
        }
    }

})();
