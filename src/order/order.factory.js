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
         * Gets orders from the server using orderService and prepares them to be used in controller.
         *
         * @param {Object}   searchParams parameters for searching orders, i.e.
         * {
         *      program: 'programID',
         *      supplyingFacility: 'facilityID',
         *      requestingFacility: 'facilityID'
         * }
         * @return {Promise}              the promise resolving to a list of all matching orders
         */
        function search(searchParams) {
            return orderService.search(searchParams);
        }

        /**
         * @ngdoc method
         * @methodOf order.orderFactory
         * @name getPod
         *
         * @description
         * Gets pod for the given order.
         *
         * @param  {String}  orderId (optional) the ID of the given order
         * @return {Promise}         the promise resolving to a POD for the given order
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
         * Gets orders from the server using orderService and filter them by status.
         *
         * @param {Object} searchParams parameters for searching orders, i.e.
         * {
         *      program: 'programID',
         *      requestingFacility: 'facilityID'
         * }
         * @return {Promise} the promise resolving to a list of all matching orders
         */
        function searchOrdersForManagePod(searchParams) {
            searchParams.status = [
                 ORDER_STATUS.PICKED,
                 ORDER_STATUS.TRANSFER_FAILED,
                 ORDER_STATUS.READY_TO_PACK,
                 ORDER_STATUS.ORDERED,
                 ORDER_STATUS.RECEIVED
            ];
            return orderService.search(searchParams);
        }
    }

})();
