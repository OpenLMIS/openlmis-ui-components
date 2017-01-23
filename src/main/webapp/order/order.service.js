(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name order.orderService
     *
     * @description
     * Responsible for RESTful communication with the Orders endpoint from the OpenLMIS server. Uses
     * URL set in the configuration file that points to the fulfillment service.
     */
    angular
        .module('order')
        .service('orderService', service);

    service.$inject = ['$resource', 'fulfillmentUrlFactory', 'dateUtils'];

    function service($resource, fulfillmentUrlFactory, dateUtils) {
        var resource = $resource(fulfillmentUrlFactory('/api/orders'), {}, {
            search: {
                isArray: true,
                method: 'GET',
                transformResponse: transformOrder,
                url: fulfillmentUrlFactory('/api/orders/search')
            }
        });

        this.search = search;

        /**
         * @ngdoc method
         * @methodOf order.orderService
         * @name search
         *
         * @description
         * Retrieves a list of Orders from the OpenLMIS server based on the given parameters.
         * Parameters that are not supported by the server will be ignored. "supplyingFacility" is
         * the only required parameter.
         *
         * @param   {Object}    params  the key-value map of parameters
         * @return  {Array}             the list of all matching orders
         */
        function search(params) {
            return resource.search(params).$promise;
        }

        function transformOrder(data, headers, status) {
            if (status === 200) {
                var orders = angular.fromJson(data);
                orders.forEach(function(order) {
                    order.processingPeriod.startDate = dateUtils.toDate(order.processingPeriod.startDate);
                    order.processingPeriod.endDate = dateUtils.toDate(order.processingPeriod.endDate);
                });
                return orders;
            }
            return data;
        }
    }

})();
