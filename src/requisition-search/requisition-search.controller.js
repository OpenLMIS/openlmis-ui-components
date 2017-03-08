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
     * @name requisition-search.controller:RequisitionViewController
     *
     * @description
     * Controller for requisition view page.
     */
    angular
        .module('requisition-search')
        .controller('RequisitionSearchController', RequisitionSearchController);

    RequisitionSearchController.$inject = [
        '$state', '$controller', '$filter', '$stateParams', 'facilities', 'notificationService',
        'offlineService', 'localStorageFactory', 'confirmService', 'items', 'stateParams',
        'totalItems',
    ];

    function RequisitionSearchController($state, $controller, $filter, $stateParams, facilities,
        notificationService, offlineService, localStorageFactory,
        confirmService, items, stateParams, totalItems) {

        var vm = this,
            offlineRequisitions = localStorageFactory('requisitions');

        vm.$onInit = onInit;
        vm.search = search;
        vm.openRnr = openRnr;
        vm.removeOfflineRequisition = removeOfflineRequisition;
        vm.isOfflineDisabled = isOfflineDisabled;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name facilities
         * @type {Array}
         *
         * @description
         * The list of all facilities available to the user.
         */
        vm.facilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name searchOffline
         * @type {Boolean}
         *
         * @description
         * Flag defining whether online or offline search should be online. If it is set to true
         * the local storage will be searched for requisitions.
         */
        vm.searchOffline = false;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name selectedFacility
         * @type {Object}
         *
         * @description
         * The facility selected by the user.
         */
        vm.selectedFacility = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name selectedProgram
         * @type {Object}
         *
         * @description
         * The program selected by the user.
         */
        vm.selectedProgram = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name startDate
         * @type {Object}
         *
         * @description
         * The beginning of the period to search for requisitions.
         */
        vm.startDate = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name endDate
         * @type {Object}
         *
         * @description
         * The end of the period to search for requisitions.
         */
        vm.endDate = undefined;

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            $controller('BasePaginationController', {
                vm: vm,
                items: items,
                totalItems: totalItems,
                stateParams: stateParams,
                externalPagination: true,
                itemValidator: undefined
            });

            vm.facilities = facilities;
            vm.stateParams.offline = $stateParams.offline === 'true' || offlineService.isOffline();

            if ($stateParams.facility) {
                vm.selectedFacility = $filter('filter')(vm.facilities, {
                    id: $stateParams.facility
                })[0];
            }

            if (vm.selectedFacility && $stateParams.program) {
                vm.selectedProgram = $filter('filter')(vm.selectedFacility.supportedPrograms, {
                    id: $stateParams.program
                })[0];
            }

            if ($stateParams.initiatedDateFrom) {
                vm.startDate = new Date($stateParams.initiatedDateFrom);
            }

            if ($stateParams.initiatedDateTo) {
                vm.endDate = new Date($stateParams.initiatedDateTo);
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name isOfflineDisabled
         *
         * @description
         * Check if "Search offline" checkbox should be disabled. It will set the searchOffline
         * flag to true if app goes in the offline mode.
         *
         * @return {Boolean} true if offline is disabled, false otherwise
         */
        function isOfflineDisabled() {
            if (offlineService.isOffline()) vm.stateParams.offline = true;
            return offlineService.isOffline();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name openRnr
         *
         * @description
         * Redirect to requisition page after clicking on grid row.
         *
         * @param {String} requisitionId Requisition UUID
         */
        function openRnr(requisitionId) {
            $state.go('requisitions.requisition.fullSupply', {
                rnr: requisitionId
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name removeOfflineRequisition
         *
         * @description
         * Removes requisition from local storage.
         *
         * @param {Resource} requisition Requisition to remove
         */
        function removeOfflineRequisition(requisition) {
            confirmService.confirmDestroy('msg.removeOfflineRequisitionQuestion').then(function() {
                offlineRequisitions.removeBy('id', requisition.id);
                requisition.$availableOffline = false;
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name search
         *
         * @description
         * Searches requisitions by criteria selected in form.
         */
        function search() {
            vm.stateParams.program = vm.selectedProgram ? vm.selectedProgram.id : null;
            vm.stateParams.facility = vm.selectedFacility ? vm.selectedFacility.id : null;
            vm.stateParams.initiatedDateFrom = vm.startDate ? vm.startDate.toISOString() : null;
            vm.stateParams.initiatedDateTo = vm.endDate ? vm.endDate.toISOString() : null;
            vm.changePage();
        }
    }
})();
