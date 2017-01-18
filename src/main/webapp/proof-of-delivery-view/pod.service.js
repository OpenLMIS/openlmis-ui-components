(function() {

	'use strict';

	/**
     * @ngdoc service
     * @name proof-of-delivery-view.podService
     *
     * @description
     * Responsible for retrieving proofs of delivery from the server.
     */
	angular
		.module('proof-of-delivery-view')
	    .service('podService', service);

    service.$inject = ['$resource', 'fulfillmentUrlFactory', 'dateUtils'];

    function service($resource, fulfillmentUrlFactory, dateUtils) {

        var resource = $resource(fulfillmentUrlFactory('/api/proofOfDeliveries/:id'), {}, {
			get: {
				method: 'GET',
				transformResponse: transformResponse
			},
			save: {
				method: 'PUT',
				transformRequest: transformRequest
			},
			submit: {
				method: 'PUT',
				url: fulfillmentUrlFactory('/api/proofOfDeliveries/:id/submit')
			}
		});

        return {
            get: get,
			save: save,
			submit: submit
        };

		/**
         * @ngdoc function
         * @name get
         * @methodOf proof-of-delivery-view.podService
         *
         * @description
         * Retrieves proof of delivery by id.
         *
         * @param {String} podId POD UUID
         * @return {Promise} POD
         */
        function get(podId) {
            return resource.get({
				id: podId
			}).$promise;
        }

		/**
         * @ngdoc function
         * @name save
         * @methodOf proof-of-delivery-view.podService
         *
         * @description
         * Saves proof of delivery.
         *
         * @return {Promise} POD
         */
        function save(pod) {
            return resource.save({
				id: pod.id
			}, pod).$promise;
        }

		/**
         * @ngdoc function
         * @name submit
         * @methodOf proof-of-delivery-view.podService
         *
         * @description
         * Submits proof of delivery.
         *
         * @return {Promise} POD
         */
        function submit(pod) {
            return resource.submit({
				id: pod.id
			}, pod).$promise;
        }

		function transformResponse(data, headers, status) {
			var pod = data;

            if (status === 200) {
                pod = angular.fromJson(data);

				if(pod.receivedDate) pod.receivedDate = dateUtils.toDate(pod.receivedDate);
				if(pod.order.createdDate) pod.order.createdDate = dateUtils.toDate(pod.order.createdDate);
            }

            return pod;
        }

		function transformRequest(pod) {
			if(pod.receivedDate) pod.receivedDate = dateUtils.toArray(pod.receivedDate);
			if(pod.order.createdDate) pod.order.createdDate = dateUtils.toArray(pod.order.createdDate, true);
            return angular.toJson(pod);
        }
    }
})();
