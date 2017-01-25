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
     * @name requisition-search.RequisitionViewController
     * @description
     * Controller for requisition view page
     */

    angular
        .module('requisition-search')
        .controller('RequisitionSearchController', RequisitionSearchController);

    RequisitionSearchController.$inject = [
        '$rootScope', '$state', 'facilityList', 'requisitionService', 'REQUISITION_STATUS',
        'dateUtils', 'loadingModalService', 'notificationService', 'offlineService'
    ];

    function RequisitionSearchController($rootScope, $state, facilityList, requisitionService,
                                         REQUISITION_STATUS, dateUtils, loadingModalService,
                                         notificationService, offlineService) {

        var vm = this;

        vm.loadPrograms = loadPrograms;
        vm.search = search;
        vm.openRnr = openRnr;

        vm.isOfflineDisabled = isOfflineDisabled;
        vm.searchOffline = offlineService.isOffline();
        vm.facilities = facilityList;
        vm.statuses = REQUISITION_STATUS.$toList();
        vm.selectedStatuses = [];

        if (!angular.isArray(vm.facilities) || vm.facilities.length < 1) {
            vm.error = 'msg.facilities.not.found';
        }

        function isOfflineDisabled() {
            if (offlineService.isOffline()) vm.searchOffline = true;
            return offlineService.isOffline();
        }
        /**
         *
         * @ngdoc function
         * @name openRnr
         * @methodOf requisition-search.RequisitionViewController
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
         * @methodOf requisition-search.RequisitionViewController
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
                notificationService.error('msg.no.program.available');
            }
        }

        /**
         *
         * @ngdoc function
         * @name search
         * @methodOf requisition-search.RequisitionViewController
         *
         * @description
         * Searches requisitions by criteria selected in form.
         *
         */
        function search() {
            if (vm.selectedFacility) {
                vm.error = null;
                loadingModalService.open();
                requisitionService.search(vm.searchOffline, {
                        program: vm.selectedProgram ? vm.selectedProgram.id : null,
                        facility: vm.selectedFacility ? vm.selectedFacility.id : null,
                        createdDateFrom: vm.startDate ? vm.startDate.toISOString() : null,
                        createdDateTo: vm.endDate ? vm.endDate.toISOString() : null
                    })
                    .then(function(requisitionList) {
                        vm.requisitionList = requisitionList;
                        loadingModalService.close();
                    })
                    .catch(function() {
                        notificationService.error('msg.error.occurred');
                    })
                    .finally(loadingModalService.close);
            } else {
                notificationService.error('msg.no.facility.selected');
            }
        }
    }
})();
