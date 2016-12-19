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
    "use strict";
    /**
     *
     * @ngdoc service
     * @name openlmis.requisitions.SupervisedFacilities
     *
     * @description
     * Returns facilities where program with given programId is active and where the given
     * user has right with given rightId.
     */
    angular.module("openlmis.requisitions")
        .factory("SupervisedFacilities", factory);

    factory.$inject = ['OpenlmisURL', '$q', '$http'];
    function factory(OpenlmisURL, $q, $http){

        return function(id, programId, rightId) {
            var deferred = $q.defer();
            var facilitiesUrl = OpenlmisURL('api/users/' + id + '/supervisedFacilities');
            $http({
                method: 'GET',
                url: facilitiesUrl,
                isArray:true,
                params: {
                    programId: programId,
                    rightId: rightId
                }
            }).then(function(response) {
                deferred.resolve(response.data);
            }).catch(function() {
                deferred.reject();
            });
            return deferred.promise;
        };
    }

})();