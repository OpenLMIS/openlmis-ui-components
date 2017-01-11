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
     * @name openlmis-referencedata.SupervisedFacilities
     *
     * @description
     * Returns facilities where program with given programId is active and where the given
     * user has right with given rightId. Facilities are stored in local storage.
     * If user is offline facilities are retreived from local storage.
     */
    angular
        .module('openlmis-referencedata')
        .factory('SupervisedFacilities', factory);

    factory.$inject = ['openlmisUrlFactory', '$q', '$http', 'offlineService', 'localStorageFactory'];

    function factory(openlmisUrlFactory, $q, $http, offlineService, localStorageFactory){
        var facilitiesOffline = localStorageFactory('supervisedFacilities');

        return function(userId, programId, rightId) {
            var deferred = $q.defer();
            if(offlineService.isOffline()) {
                var facilities = facilitiesOffline.search({
                    userIdOffline: userId,
                    programIdOffline: programId,
                    rightIdOffline: rightId
                });
                deferred.resolve(facilities);
            } else {
                var facilitiesUrl = openlmisUrlFactory('api/users/' + userId + '/supervisedFacilities');
                $http({
                    method: 'GET',
                    url: facilitiesUrl,
                    isArray:true,
                    params: {
                        programId: programId,
                        rightId: rightId
                    }
                }).then(function(response) {
                    angular.forEach(response.data, function(facility) {
                        var storageFacility = angular.copy(facility);
                        storageFacility.userIdOffline = userId;
                        storageFacility.programIdOffline = programId;
                        storageFacility.rightIdOffline = rightId;
                        facilitiesOffline.put(storageFacility);
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
