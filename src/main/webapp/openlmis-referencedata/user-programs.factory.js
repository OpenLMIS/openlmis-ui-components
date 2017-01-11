/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

(function(){
    'use strict';
    /**
     *
     * @ngdoc service
     * @name openlmis-referencedata.userProgramsFactory
     *
     * @description
     * Resposible for retriving user programs.
     */
    angular
        .module('openlmis-referencedata')
        .factory('userProgramsFactory', factory);

    factory.$inject = ['openlmisUrlFactory', '$q', '$http', 'offlineService', 'localStorageFactory'];

    function factory(openlmisUrlFactory, $q, $http, offlineService, localStorageFactory){
        var programsOffline = localStorageFactory('userPrograms'),
            factory = {
                get: get
            };

        return factory;

        /**
         * @name get
         * @methodOf openlmis-referencedata.userProgramsFactory
         *
         * @description
         * Retrieves programs for current user and saves it in local storage.
         * If user is offline program are retreived from local storage.
         *
         * @param {String} userId User UUID
         * @param {Boolean} isForHomeFacility Indicates if programs should be for home or supervised facilities
         * @return {Promise} array of programs
         */
        function get(userId, isForHomeFacility) {
            var deferred = $q.defer();
            if(offlineService.isOffline()) {
                var programs = programsOffline.search({
                    userIdOffline: userId,
                    isForHomeFacilityOffline: isForHomeFacility
                });
                deferred.resolve(programs);
            } else {
                var programsUrl = openlmisUrlFactory('api/users/' + userId + '/programs');
                $http({
                    method: 'GET',
                    url: programsUrl,
                    isArray: true,
                    params: {
                        forHomeFacility: isForHomeFacility
                    }
                }).then(function(response) {
                    angular.forEach(response.data, function(program) {
                        var storageProgram = angular.copy(program);
                        storageProgram.userIdOffline = userId;
                        storageProgram.isForHomeFacilityOffline = isForHomeFacility;
                        programsOffline.put(storageProgram);
                    });
                    deferred.resolve(response.data);
                }).catch(function() {
                    deferred.reject();
                });
            }
            return deferred.promise;
        };
    }
})();
