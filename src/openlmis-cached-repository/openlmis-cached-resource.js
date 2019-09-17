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
     * @name openlmis-cached-repository.OpenlmisCachedResource
     *
     * @description
     * Generic repository for communicating with the OpenLMIS RESTful endpoints and local database.
     */
    angular
        .module('openlmis-cached-repository')
        .factory('OpenlmisCachedResource', OpenlmisCachedResource);

    OpenlmisCachedResource.$inject = ['$q', 'LocalDatabase', 'OpenlmisResource', 'offlineService',
        'alertService'];

    function OpenlmisCachedResource($q, LocalDatabase, OpenlmisResource, offlineService, alertService) {

        OpenlmisCachedResource.prototype.get = get;
        OpenlmisCachedResource.prototype.getByVersionIdentities = getByVersionIdentities;
        OpenlmisCachedResource.prototype.query = query;
        OpenlmisCachedResource.prototype.getAll = getAll;
        OpenlmisCachedResource.prototype.update = update;
        OpenlmisCachedResource.prototype.create = create;
        OpenlmisCachedResource.prototype.delete = deleteObject;
        OpenlmisCachedResource.prototype.throwMethodNotSupported = throwMethodNotSupported;

        return OpenlmisCachedResource;

        /**
         * @ngdoc method
         * @methodOf openlmis-cached-repository.OpenlmisCachedResource
         * @name OpenlmisCachedResource
         * @constructor
         *
         * @description
         * Creates an instance of the OpenlmisCachedResource class.
         *
         * Configuration options:
         * - paginated - flag defining whether response returned by the query request is paginated; defaults to true
         * - versioned - flag defining whether handled resource is versioned; defaults to false
         *
         * @param {String} uri              the URI pointing to the resource
         * @param {String} databaseName     the databaseName pointing to the resource
         * @param {Object} config           the optional configuration object, modifies the default behavior 
         *                                  making this class more flexible
         */
        function OpenlmisCachedResource(uri, databaseName, config) {
            var newDatabase = new LocalDatabase(databaseName);
            this.database = newDatabase;

            this.isVersioned = isVersioned(config);
            if (config) {
                config.cache = true;
                config.offlineMessage = config.offlineMessage ?
                    config.offlineMessage : 'openlmisCachedResource.offlineMessage';
            }
            this.config = config;
            this.openlmisResource = new OpenlmisResource(uri, config);

        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cached-repository.OpenlmisCachedResource
         * @name get
         *
         * @description
         * Retrieves an object with the given ID from cache or from the server.
         *
         * @param  {string}  id        the ID of the object
         * @param  {strong}  versionId (optional) the version of the object
         * @return {Promise}           the promise resolving to matching object, rejects if ID is not given or if the
         *                             request fails
         */
        function get(id, versionId) {
            if (id) {
                var openlmisResource = this.openlmisResource,
                    database = this.database,
                    isVersioned = this.isVersioned;

                return database.allDocsByIndex(id, versionId).then(function(result) {
                    if (!result[0] || !versionId) {
                        openlmisResource.lastModified = result[0] ? result[0].lastModified : undefined;
                        return openlmisResource.get(id, versionId)
                            .then(function(response) {
                                isVersioned ? database.putVersioned(response.content) : database.put(response.content);
                                return response.content;
                            }, function(response) {
                                if (response.status === 304) {
                                    return result[0];
                                }
                            });
                    }
                    return result[0];
                });
            }
            return $q.reject();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cached-repository.OpenlmisCachedResource
         * @name getVersionedDocs
         *
         * @description
         * Retrieves a list of object from cache or from server if docs not exists in cache
         *
         * @param  {string}  objectsList    the list of the objects with id and specific version number
         * @return {Array}                  the array to matching objects, rejects if objects list 
         *                                  is not given or if the request fails         
         */
        function getByVersionIdentities(objectsList) {
            if (objectsList) {
                var database = this.database,
                    openlmisResource = this.openlmisResource,
                    promises = [],
                    finalDocsList = [],
                    searchList = {},
                    config = this.config;
                searchList.identities = [];

                objectsList.forEach(function(item) {
                    promises.push(database.get(item.id + '/' + item.versionNumber)
                        .then(function(result) {
                            if (result) {
                                return result;
                            }
                        })
                        .catch(function() {
                            searchList.identities.push(item);
                        }));
                });

                return $q.all(promises).then(function(docs) {
                    docs.forEach(function(doc) {
                        if (doc) {
                            finalDocsList.push(doc);
                        }
                    });

                    if (searchList.identities.length > 0 && offlineService.isOffline()) {
                        alertService.error(config.offlineMessage);
                        return $q.reject();
                    } else if (searchList.identities.length > 0) {
                        openlmisResource.resourceUrl = openlmisResource.resourceUrl + '/search';
                        return openlmisResource.search(searchList).then(function(result) {
                            result.content.content.forEach(function(doc) {
                                finalDocsList.push(doc);
                                database.putVersioned(doc);
                            });
                            return $q.all(finalDocsList).then(function(result) {
                                return result;
                            });
                        })
                            .catch(function(error) {
                                return $q.reject(error);
                            });
                    }
                    return finalDocsList;
                });
            }
            return $q.reject();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cached-repository.OpenlmisCachedResource
         * @name query
         *
         * @description
         * Return the response of the GET request or cached value. Passes the given object as request parameters.
         *
         * @param  {Object}  params the map of request parameters
         * @return {Promise}        the promise resolving to the server response or cached value, 
         *                          rejected if request fails
         */
        function query(params) {
            var openlmisResource = this.openlmisResource,
                database = this.database,
                isVersioned = this.isVersioned;

            return getLastModifiedDate(database).then(function(lastModifiedDate) {
                openlmisResource.lastModified = lastModifiedDate;
                return openlmisResource.query(params)
                    .then(function(response) {
                        if (canSaveLastModifiedDate(params)) {
                            database.put({
                                id: '_local/lastModified',
                                date: response.lastModified
                            });
                            response.content.content.forEach(function(doc) {
                                isVersioned ? database.putVersioned(doc) : database.put(doc);
                            });
                        }
                        return response;
                    }, function(response) {
                        if (response.status === 304) {
                            return database.allDocsWithLatestVersion()
                                .then(function(response) {
                                    var docs = {};
                                    docs.content = response.docs;
                                    return docs;
                                });
                        }
                    });
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cached-repository.OpenlmisCachedResource
         * @name getAll
         *
         * @description
         * Return the response of the GET request or cached value in a form of a list. 
         * Passes the given object as request
         * parameters.
         *
         * @param  {Object}  params the map of request parameters
         * @return {Promise}        the promise resolving to the server response or cached value, 
         *                          rejected if request fails
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
         * @methodOf openlmis-cached-repository.OpenlmisCachedResource
         * @name update
         *
         * @description
         * Saves the given object on the OpenLMIS server. Uses PUT method. Caches the result.
         *
         * @param  {Object}  object the object to be saved on the server
         * @return {Promise}        the promise resolving to the server response, rejected if request fails or object is
         *                          undefined or if the ID is undefined
         */
        function update(object) {
            var database = this.database,
                openlmisResource = this.openlmisResource,
                isVersioned = this.isVersioned;

            if (object) {
                return openlmisResource.update(object)
                    .then(function(response) {
                        if (isVersioned) {
                            database.putVersioned(response.content);
                            return response.content;
                        }
                        database.get(response.content.id)
                            .catch(function(error) {
                                if (error.name === 'not_found') {
                                    return {
                                        _id: response.content.id,
                                        object: response.content
                                    };
                                }
                                throw error;
                            })
                            .then(function(doc) {
                                database.put({
                                    id: doc._id,
                                    _rev: doc._rev,
                                    object: doc
                                });
                                return response.content;
                            })
                            .catch(function(error) {
                                return $q.reject(error);
                            });
                    })
                    .catch(function(error) {
                        return $q.reject(error);
                    });
            }

            return $q.reject();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cached-repository.OpenlmisCachedResource
         * @name create
         *
         * @description
         * Creates the given object on the OpenLMIS server. Uses POST method. Caches the result.
         *
         * @param  {Object}  object        the object to be created on the server
         * @param  {Object}  params        the parameters to be passed to the request
         * @return {Promise}               the promise resolving to the server response, rejected if request fails
         */
        function create(object, params) {
            var database = this.database,
                openlmisResource = this.openlmisResource,
                isVersioned = this.isVersioned;

            return openlmisResource.create(object, params)
                .then(function(response) {
                    if (isVersioned) {
                        database.putVersioned(response.content);
                        return response.content;
                    }

                    database.put({
                        id: response.content.id,
                        object: response.content
                    });
                    return response.content;
                })
                .catch(function(error) {
                    return $q.reject(error);
                });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cached-repository.OpenlmisCachedResource
         * @name delete
         *
         * @description
         * Deletes the object on the OpenLMIS server. Removes the cached object.
         *
         * @param  {Object}  object the object to be deleted from the server
         * @return {Promise}        the promise resolving to the server response, rejected if request fails or object is
         *                          undefined or if the ID is undefined
         */
        function deleteObject(object) {
            var database = this.database,
                openlmisResource = this.openlmisResource;

            if (object) {
                return openlmisResource.delete(object)
                    .then(function(response) {
                        database.allDocsByIndex(response.content.id)
                            .then(function(results) {
                                if (results.length > 1) {
                                    results.forEach(function(resource) {
                                        removeFromCache(resource.content, database);
                                    });
                                } else {
                                    removeFromCache(response.content, database);
                                }
                            });
                    })
                    .catch(function(error) {
                        return $q.reject(error);
                    });
            }
            return $q.reject();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cached-repository.OpenlmisCachedResource
         * @name throwMethodNotSupported
         *
         * @description
         * Throws 'Method not supported' exception. Useful for overriding methods which are not supported by specific
         * endpoint.
         */
        function throwMethodNotSupported() {
            throw 'Method not supported';
        }

        function isVersioned(config) {
            return !config || config.versioned || config.versioned === undefined;
        }

        function getLastModifiedDate(database) {
            return database.get('_local/lastModified')
                .then(function(result) {
                    return result.date;
                })
                .catch(function() {
                    return undefined;
                });
        }

        function canSaveLastModifiedDate(params) {
            for (var param in params) {
                if (param !== 'sort' && params[param]) {
                    return false;
                }
            }
            return true;
        }

        function isPaginated(config) {
            return !config || config.paginated || config.paginated === undefined;
        }

        function removeFromCache(resource, database) {
            database.get(resource.id).then(function(doc) {
                return database.remove(doc);
            })
                .catch(function(error) {
                    return $q.reject(error);
                });
        }
    }

})();
