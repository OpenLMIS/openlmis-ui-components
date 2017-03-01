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
     * @name referencedata-facility.facilityService
     *
     * @description
     * Responsible for retrieving all facility information from server.
     */
	angular
		.module('referencedata-facility')
	    .service('facilityService', service);

    service.$inject = [
		'$q', '$filter', '$resource', 'referencedataUrlFactory', 'offlineService',
		'localStorageFactory', 'authorizationService'
	];

    function service($q, $filter, $resource, referencedataUrlFactory, offlineService,
					 localStorageFactory, authorizationService) {

        var facilitiesOffline = localStorageFactory('facilities'),
			supervisedFacilitiesOffline = localStorageFactory('supervisedFacilities'),
			resource = $resource(referencedataUrlFactory('/api/facilities/:id'), {}, {
	            getAll: {
	                url: referencedataUrlFactory('/api/facilities/'),
	                method: 'GET',
	                isArray: true
	            },
				getUserSupervisedFacilities: {
					url: referencedataUrlFactory('api/users/:userId/supervisedFacilities'),
					method: 'GET',
	                isArray: true
				},
				getFulfillmentFacilities: {
					url: referencedataUrlFactory('/api/users/:userId/fulfillmentFacilities'),
					method: 'GET',
					isArray: true
				}
	        });

        this.get = get;
        this.getAll = getAll;
		this.getUserSupervisedFacilities = getUserSupervisedFacilities;
        this.getFulfillmentFacilities = getFulfillmentFacilities;

		/**
         * @ngdoc method
         * @methodOf referencedata-facility.facilityService
         * @name get
         *
         * @description
         * Retrieves facility by id. When user is offline it gets facility from offline storage.
         * If user is online it stores facility into offline storage.
         *
         * @param  {String}  facilityId Facility UUID
         * @return {Promise}            facility promise
         */
        function get(facilityId) {
            var facility,
				deferred = $q.defer();

			if(offlineService.isOffline()) {
				facility = facilitiesOffline.getBy('id', facilityId);
				facility ? deferred.resolve(facility) : deferred.reject();
			} else {
	            resource.get({id: facilityId}, function(data) {
					facilitiesOffline.put(data);
	                deferred.resolve(data);
	            }, function() {
	                deferred.reject();
	            });
			}

            return deferred.promise;
        }

		/**
         * @ngdoc method
         * @methodOf referencedata-facility.facilityService
         * @name getAll
         *
         * @description
         * Retrieves all facilities. When user is offline it gets facilities from offline storage.
         * If user is online it stores all facilities into offline storage.
         *
         * @return {Promise} Array of facilities
         */
        function getAll() {
            var deferred = $q.defer();

			if(offlineService.isOffline()) {
				deferred.resolve(facilitiesOffline.getAll());
			} else {
				resource.getAll(function(facilities) {
					angular.forEach(facilities, function(facility) {
						facilitiesOffline.put(facility);
					});
	                deferred.resolve(facilities);
	            }, function() {
	                deferred.reject();
	            });
			}

            return deferred.promise;
        }

		/**
		 * @ngdoc method
		 * @methodOf referencedata-facility.facilityService
         * @name getUserSupervisedFacilities
         *
         * @description
         * Returns facilities where program with the given programId is active and where the given
         * user has right with the given rightId. Facilities are stored in local storage.
         * If user is offline facilities are retrieved from the local storage.
         *
         * @param  {String}  userId    User UUID
         * @param  {String}  programId Program UUID
         * @param  {String}  rightId   Right UUID
         * @return {Promise}           supervised facilities for user
         */
        function getUserSupervisedFacilities(userId, programId, rightId) {
            var deferred = $q.defer();
            if(offlineService.isOffline()) {
                var facilities = facilitiesOffline.search({
                    userIdOffline: userId,
                    programIdOffline: programId,
                    rightIdOffline: rightId
                });
                deferred.resolve(facilities);
            } else {
				resource.getUserSupervisedFacilities({
					userId: userId,
					programId: programId,
					rightId: rightId
				}, function(response) {
                    angular.forEach(response, function(facility) {
                        var storageFacility = angular.copy(facility);
                        storageFacility.userIdOffline = userId;
                        storageFacility.programIdOffline = programId;
                        storageFacility.rightIdOffline = rightId;
                        facilitiesOffline.put(storageFacility);
                    });
                    deferred.resolve(response);
                }, function() {
                    deferred.reject();
                });
            }
            return deferred.promise;
        }

		function getFulfillmentFacilities(params) {
			return resource.getFulfillmentFacilities(params).$promise;
		}
    }
})();
