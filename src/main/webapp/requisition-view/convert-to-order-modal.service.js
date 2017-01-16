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
                requisitions.forEach(function(rnr) {
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
