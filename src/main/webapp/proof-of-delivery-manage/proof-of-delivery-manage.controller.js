/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name proof-of-delivery-manage.ProofOfDeliveryManageController
     * @description
     * Controller for proof of delivery manage page
     */

    angular
        .module('proof-of-delivery-manage')
        .controller('ProofOfDeliveryManageController', controller);

    controller.$inject = [
        'messageService', 'facility', 'user', 'supervisedPrograms', 'homePrograms', 'orderFactory',
        '$state', 'loadingModalService', 'notificationService', 'authorizationService', '$q',
        'REQUISITION_RIGHTS', 'facilityService', 'ORDER_STATUS'
    ];

    function controller(messageService, facility, user, supervisedPrograms, homePrograms,
        orderFactory, $state, loadingModalService, notificationService, authorizationService, $q,
        REQUISITION_RIGHTS, facilityService, ORDER_STATUS) {

        var vm = this;

        /**
         * @ngdoc property
         * @name requestingFacilities
         * @propertyOf proof-of-delivery-manage.ProofOfDeliveryManageController
         * @type {Array}
         *
         * @description
         * Holds available requesting facilities based on the selected type and/or programs.
         */
        vm.requestingFacilities = [];

        /**
         * @ngdoc property
         * @name supervisedPrograms
         * @propertyOf proof-of-delivery-manage.ProofOfDeliveryManageController
         * @type {Array}
         *
         * @description
         * Holds available programs where user has supervisory permissions.
         */
        vm.supervisedPrograms = supervisedPrograms;

        /**
         * @ngdoc property
         * @name homePrograms
         * @propertyOf proof-of-delivery-manage.ProofOfDeliveryManageController
         * @type {Array}
         *
         * @description
         * Holds available programs for home facility.
         */
        vm.homePrograms = homePrograms;

        /**
         * @ngdoc property
         * @name isSupervised
         * @propertyOf proof-of-delivery-manage.ProofOfDeliveryManageController
         * @type {Boolean}
         *
         * @description
         * Holds currently selected facility selection type:
         *  false - my facility
         *  true - supervised facility
         */
        vm.isSupervised = false;

        // Functions

        vm.openPod = openPod;
        vm.loadOrders = loadOrders;
        vm.programOptionMessage = programOptionMessage;
        vm.updateFacilityType = updateFacilityType;
        vm.loadFacilitiesForProgram = loadFacilitiesForProgram;
        vm.updateFacilityType(vm.isSupervised);

        /**
         * @ngdoc function
         * @name updateFacilityType
         * @methodOf proof-of-delivery-manage.ProofOfDeliveryManageController
         *
         * @description
         * Responsible for displaying and updating select elements that allow to choose
         * program and facility to initiate or proceed with the order for.
         * If isSupervised is true then it will display all programs where the current
         * user has supervisory permissions. If the param is false, then list of programs
         * from user's home facility will be displayed.
         *
         * @param {Boolean} isSupervised  indicates type of facility to initiate or proceed with
         * the orders for
         */
        function updateFacilityType(isSupervised) {

            vm.supervisedFacilitiesDisabled = vm.supervisedPrograms.length <= 0;

            if (isSupervised) {
                vm.error = '';
                vm.programs = vm.supervisedPrograms;
                vm.requestingFacilities = [];
                vm.requestingFacilityId = undefined;
                vm.selectedProgramId = undefined;

                if (vm.programs.length === 1) {
                    vm.selectedProgramId = vm.programs[0].id;
                    loadFacilitiesForProgram(vm.programs[0].id);
                }
            } else {
                vm.error = '';
                vm.programs = vm.homePrograms;
                vm.requestingFacilities = [facility];
                vm.requestingFacilityId = facility.id;
                vm.selectedProgramId = undefined;

                if (vm.programs.length <= 0) {
                    vm.error = messageService.get('msg.no.program.available');
                } else if (vm.programs.length === 1) {
                    vm.selectedProgramId = vm.programs[0].id;
                }
            }
        }


        /**
         * @ngdoc function
         * @name programOptionMessage
         * @methodOf proof-of-delivery-manage.ProofOfDeliveryManageController
         *
         * @description
         * Determines a proper message for the programs dropdown, based on the presence of programs.
         *
         * @return {String} localized message
         */
        function programOptionMessage() {
            return vm.programs === undefined || _.isEmpty(vm.programs) ? messageService.get('label.none.assigned') : messageService.get('label.select.program');
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-manage.ProofOfDeliveryManageController
         * @name loadOrders
         *
         * @description
         * Retrieves the list of orders matching the selected requesting facility and program.
         *
         * @return  {Array} the list of matching orders
         */
        function loadOrders() {
            loadingModalService.open();
            orderFactory.search(
                null,
                vm.requestingFacilityId,
                vm.selectedProgramId
            ).then(function(orders) {
                vm.orders = [];
                angular.forEach(orders, function(order) {
                    if (order.status === ORDER_STATUS.PICKED
                        || order.status === ORDER_STATUS.TRANSFER_FAILED
                        || order.status === ORDER_STATUS.READY_TO_PACK
                        || order.status === ORDER_STATUS.ORDERED
                        || order.status === ORDER_STATUS.RECEIVED) {
                        vm.orders.push(order);
                    }
                });
            }, function() {
                notificationService.error('msg.error.occurred');
            }).finally(function() {
                loadingModalService.close();
            });
        }

        /**
         *
         * @ngdoc function
         * @name openPod
         * @methodOf proof-of-delivery-manage.ProofOfDeliveryManageController
         *
         * @description
         * Redirect to POD page.
         *
         */
        function openPod(orderId) {
            loadingModalService.open();
            orderFactory.getPod(orderId).then(function(pods) {
                $state.go('orders.podView', {
                    podId: pods[0].id
                });
            }, function() {
                notificationService.error('msg.error.occurred');
            }).finally(function() {
                loadingModalService.close();
            });
        }

        /**
         * @ngdoc function
         * @name loadFacilitiesForProgram
         * @methodOf proof-of-delivery-manage.ProofOfDeliveryManageController
         *
         * @description
         * Responsible for providing a list of requesting facilities where selected program is
         * active and where the current user has supervisory permissions.
         *
         * @param {Object} selectedProgramId id of selected program where user has supervisory permissions
         */
        function loadFacilitiesForProgram(selectedProgramId) {
            if (selectedProgramId) {
                loadingModalService.open();
                var createRight = authorizationService.getRightByName(REQUISITION_RIGHTS.REQUISITION_CREATE);

                if(createRight) {
                    facilityService.getUserSupervisedFacilities(user.user_id, selectedProgramId, createRight.id)
                    .then(function (requestingFacilities) {
                        vm.requestingFacilities = requestingFacilities;
                        if (vm.requestingFacilities.length <= 0) {
                            vm.error = messageService.get('msg.no.facility.available');
                        } else {
                            vm.error = '';
                        }
                    })
                    .catch(function (error) {
                        notificationService.error('msg.error.occurred');
                        loadingModalService.close();
                    })
                    .finally(loadingModalService.close());
                } else {
                    notificationService.error('error.noActionRight');
                }
            } else {
                vm.requestingFacilities = [];
            }
        }
    }
})();
