(function() {

	'use strict';

	/**
     * @ngdoc service
     * @name openlmis-auth.userRightService
     *
     * @description
     * Responsible for calling check right endpoint.
     */
	angular
		.module('openlmis-auth')
	    .service('userRightService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {

        var resource = $resource(referencedataUrlFactory('/api/users/:userId/hasRight'), {}, {
	            hasRight: {
	                method: 'GET'
	            }
	        });

        this.hasRight = hasRight;

		/**
         * @ngdoc function
         * @name hasRight
         * @methodOf openlmis-auth.userRightService
         *
         * @description
         * Checks if user has given right.
         *
         * @param {String} userId referencedata user UUID
         * @param {String} rightId right UUID
         * @param {String} programId (optional) program UUID
         * @param {String} facilityId (optional) facility UUID
         * @param {String} warehouseId (optional) warehouse UUID
         * @return {Promise} returns true if user has right, false otherwise
         */
        function hasRight(userId, rightId, programId, facilityId, warehouseId) {
            return resource.hasRight({
                userId: userId,
                rightId: rightId,
                programId: programId,
                facilityId: facilityId,
                warehouseId: warehouseId
            }).$promise;
        }
    }
})();
