/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

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

    controller.$inject = [
        '$controller', '$state', 'proofOfDeliveryService', 'notificationService',
        'confirmService', 'ORDER_STATUS', 'pod', 'items', 'page', 'pageSize', 'totalItems'
    ];

    function controller($controller, $state, proofOfDeliveryService, notificationService,
                        confirmService, ORDER_STATUS, pod, items, page, pageSize, totalItems) {
        var vm = this;

        $controller('BasePaginationController', {
            vm: vm,
            page: page,
            items: items,
            pageSize: pageSize,
            totalItems: totalItems,
            externalPagination: false,
            itemValidator: pod.isLineItemValid
        });

        vm.savePod = savePod;
        vm.submitPod = submitPod;
        vm.isSubmitted = isSubmitted;
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
    }
}());
