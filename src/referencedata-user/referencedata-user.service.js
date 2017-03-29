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


(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name referencedata-user.referencedataUserService
     *
     * @description
     * Responsible for retrieving user info from the server.
     */
    angular
        .module('referencedata-user')
        .service('referencedataUserService', service);

    service.$inject = [
        '$q', 'openlmisUrlFactory', '$resource', 'offlineService', 'localStorageFactory'
    ];

    function service($q, openlmisUrlFactory, $resource, offlineService, localStorageFactory) {
        var offlineUserDetails = localStorageFactory('offlineUserDetails'),
            resource = $resource(openlmisUrlFactory('/api/users/:id'), {}, {
                getAll: {
                    url: openlmisUrlFactory('/api/users'),
                    method: 'GET',
                    isArray: true
                },
                search: {
                    url: openlmisUrlFactory('/api/users/search'),
                    method: 'POST'
                },
                createUser: {
                    url: openlmisUrlFactory('/api/users'),
                    method: 'PUT'
                }
            });

        this.get = get;
        this.search = search;
        this.getAll = getAll;
        this.createUser = createUser;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.referencedataUserService
         * @name get
         *
         * @description
         * Gets user by id.
         *
         * @param  {String}  id the user UUID
         * @return {Promise}    the user info
         */
        function get(id) {
            var deferred = $q.defer();

            if(offlineService.isOffline()) {
                var user = offlineUserDetails.getBy('id', id);
                if (user) {
                    deferred.resolve(user);
                } else {
                    deferred.reject();
                }
            } else {
                resource.get({id: id}).$promise.then(function(response) {
                    offlineUserDetails.put(response);
                    deferred.resolve(response);
                }, function() {
                    deferred.reject();
                });
            }

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.referencedataUserService
         * @name getAll
         *
         * @description
         * Gets all users.
         *
         * @return {Promise} the array of all users
         */
        function getAll() {
            return resource.getAll().$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.referencedataUserService
         * @name search
         *
         * @description
         * Searches for users and returns paginated result.
         *
         * @param  {Object}  params the search params
         * @return {Promise}        the page of users
         */
        function search(paginationParams, queryParams) {
            return resource.search(paginationParams, queryParams).$promise;
        }
        /**
         * @ngdoc method
         * @methodOf referencedata-user.referencedataUserService
         * @name createUser
         *
         * @description
         * Creates new user.
         *
         * @param   {Object}    user    the user to be created
         * @return  {Promise}           the promise resolving to newly created user
         */
        function createUser(user) {
            return resource.createUser(undefined, user).$promise;
        }
    }
})();
