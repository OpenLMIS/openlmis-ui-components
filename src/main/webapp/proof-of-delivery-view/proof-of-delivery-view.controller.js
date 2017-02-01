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

    controller.$inject = ['$state', '$stateParams', 'pod', 'proofOfDeliveryService', 'notificationService', 'confirmService', 'ORDER_STATUS', 'paginatedListFactory', '$filter'];

    function controller($state, $stateParams, pod, proofOfDeliveryService, notificationService, confirmService, ORDER_STATUS, paginatedListFactory, $filter) {
        var vm = this;

        vm.savePod = savePod;
        vm.submitPod = submitPod;
        vm.changePage = changePage;
        vm.getCurrentPage = getCurrentPage;

        vm.isSubmitted = isSubmitted;
        vm.typeMessage = typeMessage;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.PodViewController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and nonFullSupply states.
         */
        vm.currentPage = $stateParams.page ?  parseInt($stateParams.page) : 1;

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
         * @propertyOf proof-of-delivery-view.PodViewController
         * @name paginatedLineItems
         * @type {Object}
         *
         * @description
         * Holds line items divided into pages.
         */
        vm.paginatedLineItems = paginatedListFactory.getPaginatedItems($filter('orderBy')(vm.pod.proofOfDeliveryLineItems, '$program.productCategoryDisplayName'));

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

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.PodViewController
         * @name changePage
         *
         * @description
         * Loads line items when page is changed.
         *
         * @param {integer} newPage new page number
         */
        function changePage(newPage) {
            $state.go('orders.podView', {
                podId: vm.pod.id,
                page: newPage
            }, {
                notify: false
            });
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.PodViewController
         * @name changePage
         *
         * @description
         * Loads line items when page is changed.
         *
         * @param {integer} newPage new page number
         */
        function getCurrentPage() {
            return vm.paginatedLineItems.getPage(vm.currentPage);
        }
    }
}());
