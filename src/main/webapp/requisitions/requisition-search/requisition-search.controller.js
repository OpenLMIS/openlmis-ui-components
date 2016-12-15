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
     * @name openlmis-requisition.RequisitionViewController
     * @description
     * Controller for requisition view page
     */

    angular
        .module('openlmis.requisitions')
        .controller('RequisitionSearchController', RequisitionSearchController);

    RequisitionSearchController.$inject = ['$rootScope', '$state', 'facilityList', 'RequisitionService', 'Status', 'DateUtils', 'LoadingModalService', 'Notification', 'OfflineService'];

    function RequisitionSearchController($rootScope, $state, facilityList, RequisitionService, Status, DateUtils, LoadingModalService, Notification, OfflineService) {
        var vm = this;

        vm.loadPrograms = loadPrograms;
        vm.search = search;
        vm.openRnr = openRnr;

        vm.isOfflineDisabled = isOfflineDisabled;
        vm.searchOffline = OfflineService.isOffline;
        vm.facilities = facilityList;
        vm.statuses = Status.$toList();
        vm.selectedStatuses = [];

        if (!angular.isArray(vm.facilities) || vm.facilities.length < 1) {
            vm.error = 'msg.facilities.not.found';
        }

        function isOfflineDisabled() {
            if(OfflineService.isOffline) vm.searchOffline = true;
            return OfflineService.isOffline;
        }
        /**
         *
         * @ngdoc function
         * @name openRnr
         * @methodOf openlmis-requisition.RequisitionViewController
         *
         * @description
         * Redirect to requisition page after clicking on grid row.
         *
         */
        function openRnr(requisitionId) {
            $state.go('requisitions.requisition.fullSupply', {
                rnr: requisitionId
            });
        }

        /**
         *
         * @ngdoc function
         * @name loadPrograms
         * @methodOf openlmis-requisition.RequisitionViewController
         *
         * @description
         * Loads selected facility supported programs to program select input.
         *
         */
        function loadPrograms() {
            if (!vm.selectedFacility) {
                return;
            } else if (vm.selectedFacility.supportedPrograms) {
                vm.programs = vm.selectedFacility.supportedPrograms;
            } else {
                Notification.error('msg.no.program.available');
            }
        }

        /**
         *
         * @ngdoc function
         * @name search
         * @methodOf openlmis-requisition.RequisitionViewController
         *
         * @description
         * Searches requisitions by criteria selected in form.
         *
         */
        function search() {
            vm.requisitionList = [];
            if (vm.selectedFacility) {
                vm.error = null;
                LoadingModalService.open();
                RequisitionService.search(vm.searchOffline, {
                    program: vm.selectedProgram ? vm.selectedProgram.id : null,
                    facility: vm.selectedFacility ? vm.selectedFacility.id : null,
                    createdDateFrom: vm.startDate ? vm.startDate.toISOString() : null,
                    createdDateTo: vm.endDate ? vm.endDate.toISOString() : null
                })
                .then(function(requisitionList) {
                    vm.requisitionList = requisitionList;
                    LoadingModalService.close();
                    if (!angular.isArray(vm.requisitionList) || vm.requisitionList.length < 1) {
                        Notification.error('msg.no.requisitions.found');
                    }
                })
                .catch(function() {
                    Notification.error('msg.error.occurred');
                })
                .finally(LoadingModalService.close);
            } else {
                Notification.error('msg.no.facility.selected');
            }
        }
    }
})();
