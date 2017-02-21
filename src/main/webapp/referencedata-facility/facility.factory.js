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
     *
     * @ngdoc service
     * @name referencedata-facility.facilityFactory
     *
     * @description
     * Allows the user to retrieve facilities.
     */
    angular
        .module('referencedata-facility')
        .factory('facilityFactory', factory);

    factory.$inject = [
        'openlmisUrlFactory', '$q', '$filter', 'programService', 'authorizationService',
        'facilityService', 'REQUISITION_RIGHTS', 'FULFILLMENT_RIGHTS'
    ];

    function factory(openlmisUrlFactory, $q, $filter, programService, authorizationService,
                     facilityService, REQUISITION_RIGHTS, FULFILLMENT_RIGHTS) {

        return {
            getUserFacilities: getUserFacilities,
            getSupplyingFacilities: getSupplyingFacilities,
            getRequestingFacilities: getRequestingFacilities,
            getUserHomeFacility: getUserHomeFacility,
            getUserSupervisedFacilities: getUserSupervisedFacilities,
            getAllUserFacilities: getAllUserFacilities
        };


        /**
         * @ngdoc function
         * @name getUserFacilities
         * @methodOf referencedata-facility.facilityFactory
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

        /**
         * @ngdoc method
         * @methodOf referencedata-facility.facilityFactory
         * @name getSupplyingFacilities
         *
         * @description
         * Returns a set of all supplying facilities available to the user.
         *
         * @param   {String}    userId  the ID of the user
         * @return  {Array}             the set of all supplying facilities
         */
        function getSupplyingFacilities(userId) {
            var deferred = $q.defer();

            $q.all([
                getFulfillmentFacilities(userId, FULFILLMENT_RIGHTS.ORDERS_VIEW),
                getFulfillmentFacilities(userId, FULFILLMENT_RIGHTS.PODS_MANAGE)
            ]).then(function(results) {
                deferred.resolve($filter('unique')(results[0].concat(results[1]), 'id'));
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-facility.facilityFactory
         * @name getRequestingFacilities
         *
         * @description
         * Returns a set of all requesting facilities available to the user.
         *
         * @param   {String}    userId  the ID of the user to fetch the facilities for
         * @return  {Array}             the set of all requesting facilities
         */
        function getRequestingFacilities(userId) {
            var deferred = $q.defer();

            $q.all([
                this.getUserFacilities(userId, REQUISITION_RIGHTS.REQUISITION_CREATE),
                this.getUserFacilities(userId, REQUISITION_RIGHTS.REQUISITION_AUTHORIZE)
            ]).then(function(results) {
                deferred.resolve($filter('unique')(results[0].concat(results[1]), 'id'));
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function getFulfillmentFacilities(userId, rightName) {
            return facilityService.getFulfillmentFacilities({
                userId: userId,
                rightId: authorizationService.getRightByName(rightName).id
            });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-facility.facilityFactory
         * @name getUserHomeFacility
         *
         * @description
         * Returns home facility for the user.
         *
         * @param   {String}    userId  the ID of the user to fetch the home facility for
         * @return  {Object}            home facility
         */
        function getUserHomeFacility() {
            var deferred = $q.defer();

            authorizationService.getDetailedUser().$promise.then(function(response) {
                deferred.resolve(response.homeFacility);
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-facility.facilityFactory
         * @name getUserSupervisedFacilities
         *
         * @description
         * Returns supervised facilities for the user.
         *
         * @param   {String}    userId      the ID of the user to get supervised facilities
         * @param   {String}    programId   the ID of the program
         * @param   {String}    right       the ID of right
         * @return  {Array}                 the set of all supervised facilities
         */
        function getUserSupervisedFacilities(userId, programId, right) {
            return facilityService.getUserSupervisedFacilities(
                userId,
                programId,
                authorizationService.getRightByName(right).id
            );
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-facility.facilityFactory
         * @name getAllUserFacilities
         *
         * @description
         * Returns home facility and supervised facilities for the user.
         *
         * @param   {String}    userId      the ID of the user to get supervised facilities
         * @return  {Array}                 the set of all facilities for the user
         */
        function getAllUserFacilities(userId) {
            var deferred = $q.defer();

            $q.all([
                this.getUserFacilities(userId, REQUISITION_RIGHTS.REQUISITION_VIEW),
                this.getUserHomeFacility()
            ]).then(function(results) {
                if(!results[1]) deferred.resolve(results[0]);
                deferred.resolve($filter('unique')(results[0].concat(results[1]), 'id'));
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }
    }

})();
