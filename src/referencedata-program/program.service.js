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
     * @name referencedata-program.programService
     *
     * @description
     * Responsible for retrieving programs from the server.
     */
    angular
        .module('referencedata-program')
        .factory('programService', service);

    service.$inject = ['openlmisUrlFactory', '$resource', '$q', 'offlineService', 'localStorageFactory'];

    function service(openlmisUrlFactory, $resource, $q, offlineService, localStorageFactory){

        var resource = $resource(openlmisUrlFactory('/api/programs/:id'), {}, {
                'getAll': {
                    url: openlmisUrlFactory('/api/programs'),
                    method: 'GET',
                    isArray: true
                },
                'getUserPrograms': {
                    url: openlmisUrlFactory('api/users/:userId/programs'),
                    method: 'GET',
                    isArray: true
                }
            }),
            userProgramsOffline = localStorageFactory('userPrograms');

        return {
            get: get,
            getAll: getAll,
            getUserPrograms: getUserPrograms
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name get
         *
         * @description
         * Gets program by id.
         *
         * @param  {String}  id Program UUID
         * @return {Promise}    Program info
         */
        function get(id) {
            return resource.get({id: id}).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name getAll
         *
         * @description
         * Gets all programs and adds requisition templates to them.
         *
         * @return {Promise} Array of all programs with templates
         */
        function getAll() {
            return resource.getAll().$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name getUserPrograms
         *
         * @description
         * Retrieves programs for the current user and saves them in the local storage.
         * If the user is offline program are retreived from the local storage.
         *
         * @param  {String}  userId            User UUID
         * @param  {Boolean} isForHomeFacility Indicates if programs should be for home or supervised facilities
         * @return {Promise}                   Array of programs
         */
        function getUserPrograms(userId, isForHomeFacility) {
            var deferred = $q.defer();
            if(offlineService.isOffline()) {
                var programs = userProgramsOffline.search({
                    userIdOffline: userId,
                    isForHomeFacilityOffline: isForHomeFacility
                });
                deferred.resolve(programs);
            } else {
                resource.getUserPrograms({userId: userId, forHomeFacility: isForHomeFacility}, function(response) {
                    angular.forEach(response, function(program) {
                        var storageProgram = angular.copy(program);
                        storageProgram.userIdOffline = userId;
                        storageProgram.isForHomeFacilityOffline = isForHomeFacility;
                        userProgramsOffline.put(storageProgram);
                    });
                    deferred.resolve(response);
                }, function() {
                    deferred.reject();
                });
            }
            return deferred.promise;
        }
    }
})();
