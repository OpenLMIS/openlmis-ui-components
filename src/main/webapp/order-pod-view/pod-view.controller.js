(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name order-pod-view.PodViewController
     *
     * @description
     * Controller that drives the POD view screen.
     */
    angular.module('order-pod-view')
    .controller('PodViewController', controller);

    controller.$inject = ['$state', 'pod', 'notificationService', 'confirmService'];

    function controller($state, pod, notificationService, confirmService) {

        var vm = this;

        vm.pod = pod;

        vm.savePod = savePod;
        vm.submitPod = submitPod;
        vm.periodDisplayName = periodDisplayName;
        vm.typeMessage = typeMessage;

        /**
         * @ngdoc function
         * @name savePod
         * @methodOf order-pod-view.PodViewController
         *
         * @description
         * Saves current POD after confirming it.
         */
        function savePod() {
            confirmService.confirm('msg.orders.savePodQuestion').then(function() {
                vm.pod.$save().then(function() {
                    notificationService.success('msg.podSaved');
                    reloadState();
                }, function() {
                    notificationService.error('msg.podSavedFailed');
                });
            });
        }

        /**
         * @ngdoc function
         * @name submitPod
         * @methodOf order-pod-view.PodViewController
         *
         * @description
         * Submits current POD after confirming it.
         */
        function submitPod() {
            confirmService.confirm('msg.orders.submitPodQuestion').then(function() {
                vm.pod.$submit().then(function() {
                    notificationService.success('msg.podSubmit');
                    reloadState();
                }, function() {
                    notificationService.error('msg.podSubmitFailed');
                });
            });
        }

        /**
         * @ngdoc function
         * @name periodDisplayName
         * @methodOf order-pod-view.PodViewController
         *
         * @description
         * Formats processing period dates.
         *
         * @returns {String} Period formated dates.
         */
        function periodDisplayName() {
            return vm.pod.order.$processingPeriod.startDate.slice(0,3).join('/') + ' - ' + vm.pod.order.$processingPeriod.endDate.slice(0,3).join('/');
        }

        /**
         * @ngdoc function
         * @name periodDisplayName
         * @methodOf order-pod-view.PodViewController
         *
         * @description
         * Formats processing period dates.
         *
         * @returns {String} Period formated dates.
         */
        function typeMessage() {
            return vm.pod.order.emergency ? 'msg.emergency' : 'msg.regular';
        }

        function reloadState() {
            $state.reload();
        }
    }
}());
