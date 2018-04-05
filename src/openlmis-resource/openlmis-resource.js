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
     * @name openlmis-repository.OpenlmisResource
     *
     * @description
     * Generic repository for communicating with the OpenLMIS RESTful endpoints.
     */
    angular
        .module('openlmis-repository')
        .factory('OpenlmisResource', OpenlmisResource);

    OpenlmisResource.$inject = ['$resource', '$q', 'MAX_URI_LENGTH', 'openlmisUrlFactory', 'ParameterSplitter'];

    function OpenlmisResource($resource, $q, MAX_URI_LENGTH, openlmisUrlFactory, ParameterSplitter) {

        OpenlmisResource.prototype.query = query;
        OpenlmisResource.prototype.get = get;
        OpenlmisResource.prototype.update = update;
        OpenlmisResource.prototype.create = create;
        OpenlmisResource.prototype.delete = deleteObject;

        return OpenlmisResource;

        function OpenlmisResource(uri) {
            this.uri = uri;
            var resourceUrl = uri;

            if (uri.slice(-1) === '/') {
                resourceUrl = uri.slice(0, -1);
            }

            resourceUrl = openlmisUrlFactory(resourceUrl);

            this.resource = $resource(resourceUrl + '/:id', {}, {
                query: {
                    url: resourceUrl,
                    isArray: false
                },
                update: {
                    method: 'PUT'
                }
            });

            this.splitter = new ParameterSplitter();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisResource
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
         * @methodOf openlmis-repository.OpenlmisResource
         * @name query
         *
         * @description
         * Return the response of the GET request. Passes the given object as request parameters.
         *
         * @param   {Object}    params  the map of request parameters
         * @return  {Promise}           the promise resolving to the server response
         */
        function query(params) {
            var requests = [];
            var resource = this.resource;
            this.splitter.split(this.uri, params).forEach(function(params) {
                requests.push(resource.query(params).$promise);
            });

            return $q.all(requests)
            .then(function(responses) {
                return responses.reduce(function(left, right) {
                    left.content = left.content.concat(right.content);
                    return left;
                });
            });
        }

        function update(object) {
            return this.resource.update({
                id: object.id
            }, object).$promise;
        }

        function create(object) {
            return this.resource.save(undefined, object).$promise;
        }

        function deleteObject(object) {
            return this.resource.delete({
                id: object.id
            }).$promise;
        }

    }

})();
