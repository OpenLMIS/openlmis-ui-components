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
            },
            getPod: {
                isArray: true,
                method: 'GET',
                transformResponse: transformPOD,
                url: fulfillmentUrlFactory('/api/orders/:id/proofOfDeliveries')
            }
        });

        this.search = search;
        this.getPod = getPod;

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

        /**
         * @ngdoc method
         * @methodOf order.orderService
         * @name getPod
         *
         * @description
         * Retrieves a list of Proof of Deliveries for the given Order.
         *
         * @param   {String}    orderId     the ID of the given order
         * @return  {Array}                 the list of all PODs for the given order
         */
        function getPod(orderId) {
            return resource.getPod({
                id: orderId
            }).$promise;
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

		function transformPOD(data, headers, status) {
            if (status === 200) {
                var pods = angular.fromJson(data);
                pods.forEach(function(pod) {
				    if(pod.receivedDate) pod.receivedDate = dateUtils.toDate(pod.receivedDate);
				    if(pod.order.createdDate) pod.order.createdDate = dateUtils.toDate(pod.order.createdDate);
				});
				return pods;
            }

            return data;
        }
    }

})();
