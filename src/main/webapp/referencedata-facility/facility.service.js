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
         * @ngdoc function
         * @name get
         * @methodOf referencedata-facility.facilityService
         *
         * @description
         * Retrieves facility by id. When user is offline it gets facility from offline storage.
         * If user is online it stores facility into offline storage.
         *
         * @param {String} facilityId Facility UUID
         * @return {Promise} facility promise
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
         * @ngdoc function
         * @name getAll
         * @methodOf referencedata-facility.facilityService
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
		 * @ngdoc function
         * @name getUserSupervisedFacilities
         * @methodOf referencedata-facility.facilityService
         *
         * @description
         * Returns facilities where program with the given programId is active and where the given
         * user has right with the given rightId. Facilities are stored in local storage.
         * If user is offline facilities are retrieved from the local storage.
         *
         * @param {String} userId User UUID
         * @param {String} programId Program UUID
         * @param {String} rightId Right UUID
         * @return {Promise} supervised facilities for user
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

		function getFulfillmentFacilities(userId, rightId) {
			return resource.getFulfillmentFacilities({
				userId: userId,
				rightId: rightId
			}).$promise;
		}
    }
})();
