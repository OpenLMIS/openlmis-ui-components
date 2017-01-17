(function() {

	'use strict';

	/**
     * @ngdoc service
     * @name order-pod-view.podService
     *
     * @description
     * Responsible for retriving all proofs of delivery from server.
     */
	angular
		.module('order-pod-view')
	    .service('podService', service);

    service.$inject = ['$resource', 'ordersUrlFactory'];

    function service($resource, ordersUrlFactory) {

        var resource = $resource(ordersUrlFactory('/api/proofOfDeliveries/:id'), {}, {
			'save': {
				method: 'PUT'
			},
			'submit': {
				method: 'PUT',
				url: ordersUrlFactory('/api/proofOfDeliveries/:id/submit')
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
         * @methodOf order-pod-view.podService
         *
         * @description
         * Retrieves proof of deliery by id.
         *
         * @param {String} podId POD UUID
         * @return {Promise} POD
         */
        function get(podId) {
            return resource.get({id: podId}).$promise;
        }

		/**
         * @ngdoc function
         * @name save
         * @methodOf order-pod-view.podService
         *
         * @description
         * Saves proof of deliery.
         *
         * @return {Promise} POD
         */
        function save(pod) {
            return resource.save({id: pod.id}, pod).$promise;
        }

		/**
         * @ngdoc function
         * @name submit
         * @methodOf order-pod-view.podService
         *
         * @description
         * Submits proof of deliery.
         *
         * @return {Promise} POD
         */
        function submit(pod) {
            return resource.submit({id: pod.id}, pod).$promise;
        }
    }
})();
