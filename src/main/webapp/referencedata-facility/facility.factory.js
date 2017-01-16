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
     * @name referencedata-facility.facilitiesFactory
     *
     * @description
     * Alows the user to retrieve facilities.
     */
    angular
        .module('referencedata-facility')
        .factory('facilityFactory', factory);

    factory.$inject = ['openlmisUrlFactory', '$q', '$filter', 'programService', 'authorizationService', 'facilityService'];

    function factory(openlmisUrlFactory, $q, $filter, programService, authorizationService, facilityService){

        return {
            getUserFacilities: getUserFacilities
        };


        /**
         * @ngdoc function
         * @name getUserFacilities
         * @methodOf referencedata-facility.facilitiesFactory
         *
         * @description
         * Retrieves all user supervised facilities depending on the given access right.
         *
         * @param {String} userId User UUID
         * @param {String} rightName Name of access right
         * @return {Promise} Array of facilities
         */
        function getUserFacilities(userId, rightName) {
            var promises = [],
				facilities = [],
                right = authorizationService.getRightByName(rightName),
				deferred = $q.defer();

            programService.getUserPrograms(userId, false).then(function(supervisedPrograms) {
                angular.forEach(supervisedPrograms, function(program) {
    				promises.push(facilityService.getUserSupervisedFacilities(userId, program.id, right.id));
    			});
    			$q.all(promises).then(function(results) {
    				angular.forEach(results, function(result) {
    					facilities = facilities.concat(result);
    				});
    				deferred.resolve($filter('unique')(facilities, 'id'));
    			}, function() {
    				deferred.reject();
    			});
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }
    }

})();
