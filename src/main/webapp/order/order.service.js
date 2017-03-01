/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

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
                method: 'GET',
                transformResponse: transformOrder,
                url: fulfillmentUrlFactory('/api/orders/search')
            },
            getPod: {
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
         * @param  {Object} params the key-value map of parameters
         * @return {Promise}       the list of all matching orders
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
         * @param  {String} orderId the ID of the given order
         * @return {Promise}        the list of all PODs for the given order
         */
        function getPod(orderId) {
            return resource.getPod({
                id: orderId
            }).$promise;
        }

        function transformOrder(data, headers, status) {
            if (status === 200) {
                var orders = angular.fromJson(data);
                orders.content.forEach(function(order) {
                    order.createdDate = dateUtils.toDate(order.createdDate);
                    order.processingPeriod.startDate = dateUtils.toDate(order.processingPeriod.startDate);
                    order.processingPeriod.endDate = dateUtils.toDate(order.processingPeriod.endDate);
                });
                return orders;
            }
            return data;
        }

		function transformPOD(data, headers, status) {
            if (status === 200) {
                var pod = angular.fromJson(data);

                if(pod.receivedDate) {
                    pod.receivedDate = dateUtils.toDate(pod.receivedDate);
                }

                if(pod.order.createdDate) {
                    pod.order.createdDate = dateUtils.toDate(pod.order.createdDate);
                }

                return pod;
            }

            return data;
        }
    }

})();
