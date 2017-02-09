(function() {

	'use strict';

	/**
     * @ngdoc service
     * @name proof-of-delivery-view.proofOfDeliveryService
     *
     * @description
     * Responsible for retrieving proofs of delivery from the server.
     */
	angular
		.module('proof-of-delivery-view')
	    .service('proofOfDeliveryService', service);

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
				method: 'POST',
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
         * @methodOf proof-of-delivery-view.proofOfDeliveryService
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
         * @methodOf proof-of-delivery-view.proofOfDeliveryService
         *
         * @description
         * Saves proof of delivery.
         *
         * @param {Object} pod POD
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
         * @methodOf proof-of-delivery-view.proofOfDeliveryService
         *
         * @description
         * Submits proof of delivery.
         *
         * @param {String} podId POD UUID
         * @return {Promise} POD
         */
        function submit(podId) {
            return resource.submit({
				id: podId
			}, {}).$promise;
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
			if(pod.receivedDate) pod.receivedDate = pod.receivedDate.toISOString();
			if(pod.order.createdDate) pod.order.createdDate = pod.order.createdDate.toISOString();
            return angular.toJson(pod);
        }
    }
})();
