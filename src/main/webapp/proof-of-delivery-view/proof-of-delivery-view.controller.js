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

    controller.$inject = ['$state', 'pod', 'podService', 'notificationService', 'confirmService'];

    function controller($state, pod, podService, notificationService, confirmService) {
        var vm = this;

        vm.savePod = savePod;
        vm.submitPod = submitPod;
        vm.periodDisplayName = periodDisplayName;
        vm.typeMessage = typeMessage;

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
                podService.save(vm.pod).then(function() {
                    notificationService.success('msg.podSaved');
                    $state.reload();
                }, function() {
                    notificationService.error('msg.podSavedFailed');
                });
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
                podService.submit(vm.pod).then(function() {
                    notificationService.success('msg.podSubmit');
                    $state.reload();
                }, function() {
                    notificationService.error('msg.podSubmitFailed');
                });
            });
        }

        /**
         * @ngdoc method
         * @name periodDisplayName
         * @methodOf proof-of-delivery-view.PodViewController
         *
         * @description
         * Formats processing period dates.
         *
         * @returns {String} Period formated dates.
         */
        function periodDisplayName() {
            return vm.pod.order.processingPeriod.startDate.slice(0,3).join('/') + ' - ' + vm.pod.order.processingPeriod.endDate.slice(0,3).join('/');
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
            return vm.pod.order.emergency ? 'msg.emergency' : 'msg.regular';
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
