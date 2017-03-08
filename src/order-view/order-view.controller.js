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
     * @name order-view.controller:OrderViewController
     *
     * @description
     * Responsible for managing Order View. Exposes facilities/programs to populate selects and
     * fetches data to populate grid.
     */
    angular
        .module('order-view')
        .controller('OrderViewController', controller);

    controller.$inject = [
        'supplyingFacilities', 'requestingFacilities', 'programs', 'orderFactory',
        'loadingModalService', 'notificationService', 'fulfillmentUrlFactory', 'items', 'stateParams',
        'totalItems', '$controller', '$stateParams', '$filter'
    ];

    function controller(supplyingFacilities, requestingFacilities, programs, orderFactory,
                        loadingModalService, notificationService, fulfillmentUrlFactory,
                        items, stateParams, totalItems, $controller, $stateParams, $filter) {

        var vm = this;

        vm.$onInit = onInit;
        vm.loadOrders = loadOrders;
        vm.getPrintUrl = getPrintUrl;
        vm.getDownloadUrl = getDownloadUrl;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name supplyingFacilities
         * @type {Array}
         *
         * @description
         * The list of all supplying facilities available to the user.
         */
        vm.supplyingFacilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name requestingFacilities
         * @type {Array}
         *
         * @description
         * The list of requesting facilities available to the user.
         */
        vm.requestingFacilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name programs
         * @type {Array}
         *
         * @description
         * The list of all programs available to the user.
         */
        vm.programs = undefined;

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            vm.supplyingFacilities = supplyingFacilities;
            vm.requestingFacilities = requestingFacilities;
            vm.programs = programs;

            $controller('BasePaginationController', {
                vm: vm,
                items: items,
                stateParams: stateParams,
                totalItems: totalItems,
                externalPagination: true,
                itemValidator: undefined
            });

            if ($stateParams.supplyingFacility) {
                vm.supplyingFacility = $filter('filter')(vm.supplyingFacilities, {
                    id: $stateParams.supplyingFacility
                })[0];
            }

            if ($stateParams.requestingFacility) {
                vm.requestingFacility = $filter('filter')(vm.requestingFacilities, {
                    id: $stateParams.requestingFacility
                })[0];
            }

            if ($stateParams.program) {
                vm.program = $filter('filter')(vm.programs, {
                    id: $stateParams.program
                })[0];
            }
        }


        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name loadOrders
         *
         * @description
         * Retrieves the list of orders matching the selected supplying facility, requesting
         * facility and program.
         *
         * @return {Array} the list of matching orders
         */
        function loadOrders() {
            vm.stateParams.supplyingFacility = vm.supplyingFacility ? vm.supplyingFacility.id : null;
            vm.stateParams.requestingFacility = vm.requestingFacility ? vm.requestingFacility.id : null;
            vm.stateParams.program = vm.program ? vm.program.id : null;
            vm.changePage();
        }

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name getPrintUrl
         *
         * @description
         * Prepares a print URL for the given order.
         *
         * @param  {Object} order the order to prepare the URL for
         * @return {String}       the prepared URL
         */
        function getPrintUrl(order) {
            return fulfillmentUrlFactory('/api/orders/' + order.id + '/print?format=pdf');
        }

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name getDownloadUrl
         *
         * @description
         * Prepares a download URL for the given order.
         *
         * @param  {Object} order the order to prepare the URL for
         * @return {String}       the prepared URL
         */
        function getDownloadUrl(order) {
            return fulfillmentUrlFactory('/api/orders/' + order.id + '/export?type=csv');
        }

    }

})();
