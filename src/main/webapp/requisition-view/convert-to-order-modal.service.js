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

(function(){
    "use strict";

    /**
     *
     * @ngdoc service
     * @name requisition-view.convertToOrderModalService
     * @description
     * Directive to display modal for converting single requisition to order.
     *
     */

    angular
        .module('requisition-view')
        .service('convertToOrderModalService', convertToOrderModal);

    convertToOrderModal.$inject = ['$q', '$state', '$rootScope', '$ngBootbox', 'messageService',
        '$compile', '$templateRequest', 'requisitionService', '$stateParams', 'loadingModalService'];

    function convertToOrderModal($q, $state, $rootScope, $ngBootbox, messageService, $compile,
        $templateRequest, requisitionService, $stateParams, loadingModalService) {

        var deferred, vm;

        this.show = show;

        /**
         * @ngdoc function
         * @name show
         * @methodOf requisition-view.convertToOrderModalService
         * @param {Object} requisition Requisition for convert
         * @return {Promises} depots for requisition and template for modal
         *
         * @description
         * Shows modal to convert requisition.
         *
         */
        function show(requisition) {
            var scope = $rootScope.$new();

            deferred = $q.defer();

            scope.vm = {};
            vm = scope.vm;

            vm.convertRnr = convertRnr;

            vm.requisition = requisition;
            vm.searchText = undefined;

            $q.all([
                getDepotsForRequisition(),
                $templateRequest('requisition-view/convert-to-order-modal.html')
            ]).then(function(result) {
                var depots = result[0],
                    template = result[1];

                vm.requisitionWithDepots = depots;
                vm.requisitionWithDepots.requisition.supplyingFacility = undefined;

                $ngBootbox.customDialog({
                    title: vm.requisition.program.name + ' (' + vm.requisition.facility.type.name +
                           '): ' + messageService.get('label.convert.requisition.to.order'),
                    message: $compile(angular.element(template))(scope),
                    className: 'convert-to-order-modal'
                });
            }, reject);

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name convertRnr
         * @methodOf requisition-view.convertToOrderModalService
         *
         * @description
         * Converts given requisition into order and then reload page.
         */
        function convertRnr() {
            requisitionService.convertToOrder([
                vm.requisitionWithDepots
            ]).then(function() {
                $ngBootbox.hideAll();
                deferred.resolve();
                $state.reload();
            }, reject);
        }

        /**
         * @ngdoc function
         * @name getDepotsForRequisition
         * @methodOf requisition-view.convertToOrderModalService
         * @return {Promise} Depots for current requisition.
         *
         * @description
         * Get depots for current requisition.
         *
         */
        function getDepotsForRequisition() {
            var deferred = $q.defer();

            loadingModalService.open();
            requisitionService.forConvert({
                filterBy: $stateParams.filterBy,
                filterValue: $stateParams.filterValue,
                sortBy: $stateParams.sortBy,
                descending: $stateParams.descending
            }).then(function(requisitions) {
                requisitions.content.forEach(function(rnr) {
                    if (rnr.requisition.id == vm.requisition.id) {
                        deferred.resolve(rnr);
                    }
                });
            }, reject).finally(function() {
                loadingModalService.close();
            });

            return deferred.promise;
        }

        function reject(deferred) {
            deferred.reject();
        }
    }
})();
