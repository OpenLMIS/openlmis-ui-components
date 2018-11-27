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
        OpenlmisResource.prototype.getAll = getAll;
        OpenlmisResource.prototype.update = update;
        OpenlmisResource.prototype.create = create;
        OpenlmisResource.prototype.delete = deleteObject;
        OpenlmisResource.prototype.throwMethodNotSupported = throwMethodNotSupported;

        return OpenlmisResource;

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisResource
         * @name OpenlmisResource
         * @constructor
         *
         * @description
         * Creates an instance of the OpenlmisResource class.
         *
         * Configuration options:
         * - paginated - flag defining whether response returned by the query request is paginated; defaults to true
         *
         * @param {String} uri    the URI pointing to the resource
         * @param {Object} config the optional configuration object, modifies the default behavior making this class
         *                        more flexible
         */
        function OpenlmisResource(uri, config) {
            this.uri = uri;
            this.config = config;
            var resourceUrl = uri;

            if (uri.slice(-1) === '/') {
                resourceUrl = uri.slice(0, -1);
            }

            resourceUrl = openlmisUrlFactory(resourceUrl);

            this.resource = $resource(resourceUrl + '/:id', {}, {
                query: {
                    url: resourceUrl,
                    isArray: !isPaginated(config)
                },
                update: {
                    method: 'PUT'
                }
            });

            this.idParam = getIdParam(config);
            this.splitter = new ParameterSplitter();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisResource
         * @name get
         *
         * @description
         * Retrieves an object with the given ID.
         *
         * @param  {string}  id the ID of the object
         * @return {Promise}    the promise resolving to server response, rejects if ID is not given or if the request
         *                      fails
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
         * @name getAll
         *
         * @description
         * Return the response of the GET request in a form of a list. Passes the given object as request parameters.
         *
         * @param  {Object}  params the map of request parameters
         * @return {Promise}        the promise resolving to the server response, rejected if request fails
         */
        function getAll(params) {
            var config = this.config;
            return this.query(params)
                .then(function(response) {
                    return isPaginated(config) ? response.content : response;
                });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisResource
         * @name query
         *
         * @description
         * Return the response of the GET request. Passes the given object as request parameters.
         *
         * @param  {Object}  params the map of request parameters
         * @return {Promise}        the promise resolving to the server response, rejected if request fails
         */
        function query(params) {
            var requests = [];
            var resource = this.resource;
            this.splitter.split(this.uri, params)
                .forEach(function(params) {
                    requests.push(resource.query(params).$promise);
                });

            return $q.all(requests)
                .then(function(responses) {
                    if (responses[0] instanceof Array) {
                        return responses.reduce(function(left, right) {
                            right.forEach(function(item) {
                                left.push(item);
                            });
                            return left;
                        });
                    }

                    return responses.reduce(function(left, right) {
                        left.content = left.content.concat(right.content);
                        left.numberOfElements += right.numberOfElements;
                        left.totalElements += right.totalElements;
                        return left;
                    });
                });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisResource
         * @name update
         * 
         * @description
         * Saves the given object on the OpenLMIS server. Uses PUT method.
         * 
         * @param  {Object}  object the object to be saved on the server
         * @return {Promise}        the promise resolving to the server response, rejected if request fails or object is
         *                          undefined or if the ID is undefined
         */
        function update(object) {
            if (object) {
                return this.resource.update({
                    id: object[this.idParam]
                }, object).$promise;
            }
            return $q.reject();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisResource
         * @name create
         * 
         * @description
         * Creates the given object on the OpenLMIS server. Uses POST method.
         * 
         * @param  {Object}  object the object to be created on the server
         * @return {Promise}        the promise resolving to the server response, rejected if request fails
         */
        function create(object) {
            return this.resource.save(undefined, object).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisResource
         * @name delete
         * 
         * @description
         * Deletes the object on the OpenLMIS server.
         * 
         * @param  {Object}  object the object to be deleted from the server
         * @return {Promise}        the promise resolving to the server response, rejected if request fails or object is
         *                          undefined or if the ID is undefined
         */
        function deleteObject(object) {
            if (object && object[this.idParam]) {
                return this.resource.delete({
                    id: object[this.idParam]
                }).$promise;
            }
            return $q.reject();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisResource
         * @name throwMethodNotSupported
         *
         * @description
         * Throws 'Method not supported' exception. Useful for overriding methods which are not supported by specific
         * endpoint.
         */
        function throwMethodNotSupported() {
            throw 'Method not supported';
        }

        function isPaginated(config) {
            return !config || config.paginated || config.paginated === undefined;
        }

        function getIdParam(config) {
            if (config) {
                return config.idParam || 'id';
            }
            return 'id';
        }

    }

})();
