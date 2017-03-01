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
     * @name openlmis-user.userFactory
     *
     * @description
     * Allows user to perform actions on user resource
     */
    angular
        .module('openlmis-user')
        .factory('userFactory', factory);

    factory.$inject = ['openlmisUrlFactory', '$resource', '$q', '$injector', 'localStorageFactory'];

    function factory(openlmisUrlFactory, $resource, $q, $injector, localStorageFactory) {

        var offlineService = $injector.get('offlineService'),
            offlineUserDetails = localStorageFactory('offlineUserDetails'),
            resource = $resource(openlmisUrlFactory('/api/users/:id'), {}, {
                'update': {
                    url: openlmisUrlFactory('/api/users/update/:id'),
                    method: 'POST'
                }
            });

        var factory = {
            get: get
        };
        return factory;


        /**
         * @ngdoc method
         * @name get
         * @methodOf openlmis-user.userFactory
         *
         * @description
         * Gets user by id.
         *
         * @param  {String}   id User id
         * @return {Resource}    User info
         */
        function get(id) {
            var deferred = $q.defer();

            if(offlineService.isOffline()) {
                var user = offlineUserDetails.getBy('id', id);
                user ? deferred.resolve(user) : deferred.reject();
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
    }

})();
