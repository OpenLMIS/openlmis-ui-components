(function() {

	'use strict';

	/**
     * @ngdoc service
     * @name requisition-search.facilityService
     *
     * @description
     * Responsible for retriving all facility information from server.
     */
	angular
		.module('requisition-search')
	    .service('facilityService', service);

    service.$inject = [
		'$q', '$filter', '$resource', 'openlmisUrlFactory', 'offlineService', 'localStorageFactory',
		'supervisedFacilitiesFactory', 'authorizationService', 'REQUISITION_RIGHTS'
	];

    function service($q, $filter, $resource, openlmisUrlFactory, offlineService,
					 localStorageFactory, supervisedFacilitiesFactory, authorizationService,
					 REQUISITION_RIGHTS) {

        var resource = $resource(openlmisUrlFactory('/api/facilities/:id'), {}, {
            'getAll': {
                url: openlmisUrlFactory('/api/facilities/'),
                method: 'GET',
                isArray: true
            }
        }),

		facilitiesOffline = localStorageFactory('facilities'),

        service = {
            get: get,
            getAll: getAll,
			getsupervisedFacilitiesFactory: getsupervisedFacilitiesFactory
        };
        return service;

		/**
         * @ngdoc function
         * @name get
         * @methodOf requisition-search.facilityService
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
         * @methodOf requisition-search.facilityService
         * @return {Promise} Array of facilities
         *
         * @description
         * Retrieves all facilities. When user is offline it gets facilities from offline storage.
         * If user is online it stores all facilities into offline storage.
         *
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
         * @name getsupervisedFacilitiesFactory
         * @methodOf requisition-search.facilityService
         * @return {Promise} Array of facilities
         *
         * @description
         * Retrieves all user supervised facilities.
         * When user is offline it gets facilities from offline storage.
         * If user is online it stores all facilities into offline storage.
         *
         */
        function getsupervisedFacilitiesFactory(supervisedPrograms, userId) {
            var promises = [],
				facilities = [],
				viewRight = authorizationService.getRightByName(REQUISITION_RIGHTS.REQUISITION_VIEW),
				deferred = $q.defer();

			angular.forEach(supervisedPrograms, function(program) {
				promises.push(supervisedFacilitiesFactory.get(userId, program.id, viewRight.id));
			});
			$q.all(promises).then(function(results) {
				angular.forEach(results, function(result) {
					facilities = facilities.concat(result);
				});
				deferred.resolve($filter('unique')(facilities, 'id'));
			}, function() {
				deferred.reject();
			});

            return deferred.promise;
        }
    }
})();
