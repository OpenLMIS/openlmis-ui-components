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
     * @name proof-of-delivery-manage.controller:ProofOfDeliveryManageController
     *
     * @description
     * Controller for proof of delivery manage page
     */
    angular
        .module('proof-of-delivery-manage')
        .controller('ProofOfDeliveryManageController', controller);

    controller.$inject = [
        'facility', 'userId', 'supervisedPrograms', 'homePrograms', 'orderFactory', '$state',
        'loadingModalService', 'notificationService', 'authorizationService', '$q',
        'REQUISITION_RIGHTS', 'facilityFactory', 'ORDER_STATUS'
    ];

    function controller(facility, userId, supervisedPrograms, homePrograms, orderFactory, $state,
        loadingModalService, notificationService, authorizationService, $q, REQUISITION_RIGHTS,
        facilityFactory, ORDER_STATUS) {

        var vm = this;

        vm.openPod = openPod;
        vm.loadOrders = loadOrders;
        vm.updateFacilityType = updateFacilityType;
        vm.loadFacilitiesForProgram = loadFacilitiesForProgram;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name requestingFacilities
         * @type {Array}
         *
         * @description
         * Holds available requesting facilities based on the selected type and/or programs.
         */
        vm.requestingFacilities = [];

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name supervisedPrograms
         * @type {Array}
         *
         * @description
         * Holds available programs where user has supervisory permissions.
         */
        vm.supervisedPrograms = supervisedPrograms;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name homePrograms
         * @type {Array}
         *
         * @description
         * Holds available programs for home facility.
         */
        vm.homePrograms = homePrograms;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name isSupervised
         * @type {Boolean}
         *
         * @description
         * Holds currently selected facility selection type:
         *  false - my facility
         *  true - supervised facility
         */
        vm.isSupervised = false;

        updateFacilityType(vm.isSupervised);

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name updateFacilityType
         *
         * @description
         * Responsible for displaying and updating select elements that allow to choose
         * program and facility to initiate or proceed with the order for.
         * If isSupervised is true then it will display all programs where the current
         * user has supervisory permissions. If the param is false, then list of programs
         * from user's home facility will be displayed.
         *
         * @param {Boolean} isSupervised indicates type of facility to initiate or proceed with
         * the orders for
         */
        function updateFacilityType(isSupervised) {
            if (isSupervised) {
                vm.programs = vm.supervisedPrograms;
                vm.requestingFacilities = [];
                vm.requestingFacilityId = undefined;
                vm.selectedProgramId = undefined;

                if (vm.programs.length === 1) {
                    vm.selectedProgramId = vm.programs[0].id;
                    loadFacilitiesForProgram(vm.programs[0].id);
                }
            } else {
                vm.programs = vm.homePrograms;
                vm.requestingFacilities = [facility];
                vm.requestingFacilityId = facility.id;
                vm.selectedProgramId = undefined;

                 if (vm.programs.length === 1) {
                    vm.selectedProgramId = vm.programs[0].id;
                }
            }
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name loadOrders
         *
         * @description
         * Retrieves the list of orders matching the selected requesting facility and program.
         *
         * @return {Array} the list of matching orders
         */
        function loadOrders() {
            withUiBlocking(orderFactory.searchOrdersForManagePod(
                vm.requestingFacilityId,
                vm.selectedProgramId
            )).then(function(data) {
                vm.orders = data.content;
            });
        }

        /**
         *
         * @ngdoc method
         * @methodOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name openPod
         *
         * @description
         * Redirect to POD page.
         *
         * @param {String} orderId id of order to find it's POD
         */
        function openPod(orderId) {
            withUiBlocking(orderFactory.getPod(orderId)).then(function(pod) {
                $state.go('orders.podView', {
                    podId: pod.id
                });
            }, function() {
                notificationService.error('msg.noOrderFound');
            });
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name loadFacilitiesForProgram
         *
         * @description
         * Responsible for providing a list of requesting facilities where selected program is
         * active and where the current user has supervisory permissions.
         *
         * @param {Object} selectedProgramId id of selected program where user has supervisory permissions
         */
        function loadFacilitiesForProgram(programId) {
            if (programId) {
                withUiBlocking(facilityFactory.getUserSupervisedFacilities(
                    userId, programId, REQUISITION_RIGHTS.REQUISITION_CREATE
                )).then(function(facilities) {
                    vm.requestingFacilities = facilities;
                }, function() {
                    notificationService.error('msg.invalidProgramOrRight');
                });
            } else {
                vm.requestingFacilities = [];
            }
        }

        function withUiBlocking(promise) {
            loadingModalService.open();
            promise.finally(loadingModalService.close);
            return promise;
        }
    }
})();
