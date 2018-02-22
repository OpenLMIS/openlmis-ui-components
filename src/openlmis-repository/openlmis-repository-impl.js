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
     * @name openlmis-repository.OpenLMISRepositoryImpl
     *
     * @description
     * Generic repository for communicating with the OpenLMIS RESTful endpoints.
     */
    angular
        .module('openlmis-repository')
        .factory('OpenLMISRepositoryImpl', OpenLMISRepositoryImpl);

    OpenLMISRepositoryImpl.$inject = ['$resource', '$q'];

    function OpenLMISRepositoryImpl($resource, $q) {

        OpenLMISRepositoryImpl.prototype.query = query;
        OpenLMISRepositoryImpl.prototype.get = get;

        return OpenLMISRepositoryImpl;

        function OpenLMISRepositoryImpl(url) {
            var resourceUrl = url;

            if (url.slice(-1) === '/') {
                resourceUrl = url.slice(0, -1)
            }

            this.resource = $resource(resourceUrl + '/:id', {}, {
                query: {
                    url:  resourceUrl,
                    isArray: false
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenLMISRepositoryImpl
         * @name get
         *
         * @description
         * Retrieves a shipment with the given ID.
         *
         * @param   {string}    id  the ID of the shipment
         * @return  {Promise}       the promise resolving to server response, rejects if ID is not
         *                          given or if the request fails
         */
        function get(id) {
            if (id) {
                return this.resource.get({
                    id: id
                }).$promise;
            }
            return $q.reject();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenLMISRepositoryImpl
         * @name query
         *
         * @description
         * Return the response of the GET request. Passes the given object as request parameters.
         *
         * @param   {Object}    params  the map of request parameters
         * @return  {Promise}           the promise resolving to the server response
         */
        function query(params) {
            return this.resource.get(params).$promise;
        }

    }

})();
