(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name proof-of-delivery-view.PodViewController
     *
     * @description
     * Controller that drives the POD view screen.
     */
    angular.module('proof-of-delivery-view')
    .controller('ProofOfDeliveryViewController', controller);

    controller.$inject = ['$state', 'pod', 'proofOfDeliveryService', 'notificationService', 'confirmService', 'ORDER_STATUS'];

    function controller($state, pod, proofOfDeliveryService, notificationService, confirmService, ORDER_STATUS) {
        var vm = this;

        vm.savePod = savePod;
        vm.submitPod = submitPod;
        vm.typeMessage = typeMessage;

        vm.isSubmitted = isSubmitted;

        /**
         * @ngdoc property
         * @name proof of delivery
         * @propertyOf proof-of-delivery-view.PodViewController
         * @type {Object}
         *
         * @description
         * Holds Proof of Delivery.
         */
        vm.pod = pod;

        /**
         * @ngdoc property
         * @name categories
         * @propertyOf proof-of-delivery-view.PodViewController
         * @type {Object}
         *
         * @description
         * Holds product categories with attached programs.
         */
        vm.categories = groupByCategory(vm.pod.proofOfDeliveryLineItems);

        /**
         * @ngdoc method
         * @name savePod
         * @methodOf proof-of-delivery-view.PodViewController
         *
         * @description
         * Saves current POD after confirming it.
         */
        function savePod() {
            confirmService.confirm('msg.orders.savePodQuestion').then(function() {
                if(vm.pod.isValid()) {
                    proofOfDeliveryService.save(vm.pod).then(function() {
                        notificationService.success('msg.podSaved');
                        $state.reload();
                    }, function() {
                        notificationService.error('msg.podSavedFailed');
                    });
                } else {
                    notificationService.error('error.podInvalid');
                }
            });
        }

        /**
         * @ngdoc method
         * @name submitPod
         * @methodOf proof-of-delivery-view.PodViewController
         *
         * @description
         * Submits current POD after confirming it.
         */
        function submitPod() {
            confirmService.confirm('msg.orders.submitPodQuestion').then(function() {
                if(vm.pod.isValid()) {
                    proofOfDeliveryService.save(vm.pod).then(function() {
                        proofOfDeliveryService.submit(vm.pod.id).then(function() {
                            notificationService.success('msg.podSubmitted');
                            $state.reload();
                        }, function() {
                            notificationService.error('msg.podSubmitFailed');
                        });
                    }, function() {
                        notificationService.error('msg.podSavedFailed');
                    });
                } else {
                    notificationService.error('error.podInvalid');
                }
            });
        }

        function isSubmitted() {
            return vm.pod.order.status === ORDER_STATUS.RECEIVED;
        }

        /**
         * @ngdoc method
         * @name typeMessage
         * @methodOf proof-of-delivery-view.PodViewController
         *
         * @description
         * Provides display messages for order types.
         *
         * @returns {String} Order type message
         */
        function typeMessage() {
            return vm.pod.order.emergency ? 'label.emergency' : 'msg.regular';
        }

        function groupByCategory(lineItems) {
            var categories = {};
            angular.forEach(lineItems, function(lineItem) {
                var category = lineItem.$program.productCategoryDisplayName;
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(lineItem);
            });
            return categories;
        }
    }
}());
