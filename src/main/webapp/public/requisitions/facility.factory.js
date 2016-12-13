(function() {

	'use strict';

	angular.module('openlmis.requisitions')
	    .factory('FacilityFactory', FacilityFactory);

    FacilityFactory.$inject = ['$q', '$resource', 'OpenlmisURL', 'Offline', 'FacilityStorage'];

    function FacilityFactory($q, $resource, OpenlmisURL, Offline, FacilityStorage) {
        var resource = $resource(OpenlmisURL('/api/facilities/:id'), {}, {
            'getAll': {
                url: OpenlmisURL('/api/facilities/'),
                method: 'GET',
                isArray: true
            }
        }),

        factory = {
            get: get,
            getAll: getAll
        };
        return factory;

        function get(facilityId) {
            var facility,
				deferred = $q.defer();

			if(Offline.isOffline) {
				facility = FacilityStorage.get(facilityId);
				facility ? deferred.resolve(facility) : deferred.reject();
			} else {
	            resource.get({id: facilityId}, function(data) {
					FacilityStorage.put(data);
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
				deferred.resolve(FacilityStorage.getAll());
			} else {
				resource.getAll(function(facilities) {
					angular.forEach(facilities, function(facility) {
						FacilityStorage.put(facility);
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
