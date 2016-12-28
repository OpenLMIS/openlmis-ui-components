(function() {

	'use strict';

	/**
     * @ngdoc service
     * @name openlmis-requisitions.FacilityService
     *
     * @description
     * Responsible for retriving all facility information from server.
     */
	angular.module('openlmis-requisitions')
	    .service('FacilityService', FacilityService);

    FacilityService.$inject = ['$q', '$resource', 'OpenlmisURL', 'OfflineService', 'localStorageFactory'];

    function FacilityService($q, $resource, OpenlmisURL, OfflineService, localStorageFactory) {
        var resource = $resource(OpenlmisURL('/api/facilities/:id'), {}, {
            'getAll': {
                url: OpenlmisURL('/api/facilities/'),
                method: 'GET',
                isArray: true
            }
        }),

		facilitiesOffline = localStorageFactory('facilities'),

        service = {
            get: get,
            getAll: getAll
        };
        return service;

		/**
         * @ngdoc function
         * @name get
         * @methodOf openlmis-requisitions.FacilityService
         * @param {String} facilityId Facility UUID
         * @return {Promise} facility promise
         *
         * @description
         * Retrieves facility by id. When user is offline it gets facility from offline storage.
         * If user is online it stores facilitiy into offline storage
         *
         */
        function get(facilityId) {
            var facility,
				deferred = $q.defer();

			if(OfflineService.isOffline()) {
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
         * @methodOf openlmis-requisitions.FacilityService
         * @return {Promise} Array of facilities
         *
         * @description
         * Retrieves all facilities. When user is offline it gets facilities from offline storage.
         * If user is online it stores all facilities into offline storage
         *
         */
        function getAll() {
            var deferred = $q.defer();

			if(OfflineService.isOffline()) {
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
    }
})();
