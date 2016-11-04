(function() {
	
	'use strict';

	angular.module('openlmis.requisitions')
	    .factory('FacilityFactory', FacilityFactory);

    FacilityFactory.$inject = ['$q', '$resource', 'OpenlmisURL'];

    function FacilityFactory($q, $resource, OpenlmisURL) {
        var resource = $resource(OpenlmisURL('/referencedata/api/facilities/:id'), {}, {
            'getAll': {
                url: OpenlmisURL('/referencedata/api/facilities/'),
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
            var deferred = $q.defer();

            resource.get({id: facilityId}, function(data) {
                deferred.resolve(data);
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function getAll() {
            var deferred = $q.defer();

            resource.getAll(function(data) {
                deferred.resolve(data);
            }, function() {
                deferred.reject();
            });
            
            return deferred.promise;
        }
    }
})();