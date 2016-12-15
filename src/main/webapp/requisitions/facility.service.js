(function() {

	'use strict';

	angular.module('openlmis.requisitions')
	    .service('FacilityService', FacilityService);

    FacilityService.$inject = ['$q', '$resource', 'OpenlmisURL', 'Offline', 'localStorageFactory'];

    function FacilityService($q, $resource, OpenlmisURL, Offline, localStorageFactory) {
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

        function get(facilityId) {
            var facility,
				deferred = $q.defer();

			if(Offline.isOffline) {
				facility = facilitiesOffline.get(facilityId);
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

        function getAll() {
            var deferred = $q.defer();

			if(Offline.isOffline) {
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
