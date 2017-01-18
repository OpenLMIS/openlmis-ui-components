(function() {

	'use strict';

	/**
     * @ngdoc service
     * @name referencedata-period.periodService
     *
     * @description
     * Responsible for retriving all processing period information from the server.
     */
	angular
		.module('referencedata-period')
	    .service('periodService', service);

    service.$inject = ['$resource', 'openlmisUrlFactory'];

    function service($resource, openlmisUrlFactory) {

        var resource = $resource(openlmisUrlFactory('/api/processingPeriods/:id'), {}, {});

        this.get = get;

		/**
         * @ngdoc method
         * @name get
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Retrieves processing period from the server by id.
         *
         * @param {String} periodId Period UUID
         * @return {Promise} Period
         */
        function get(periodId) {
            return resource.get({
				id: periodId
			}).$promise;
        }
    }
})();
