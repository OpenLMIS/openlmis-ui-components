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
