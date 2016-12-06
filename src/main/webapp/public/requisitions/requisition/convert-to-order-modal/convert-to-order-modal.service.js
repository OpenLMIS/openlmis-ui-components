(function(){
    "use strict";

    /**
     *
     * @ngdoc service
     * @name openlmis.requisitions.ConvertToOrderModal
     * @description
     * Directive to display modal for converting single requisition to order.
     *
     */

    angular.module('openlmis.requisitions')
        .service('ConvertToOrderModal', convertToOrderModal);

    convertToOrderModal.$inject = ['$q', '$state', '$rootScope', '$ngBootbox', 'messageService',
        '$compile', '$templateRequest', 'RequisitionService', '$stateParams', 'LoadingModalService'];

    function convertToOrderModal($q, $state, $rootScope, $ngBootbox, messageService, $compile,
        $templateRequest, RequisitionService, $stateParams, LoadingModalService) {

        var deferred, scope = $rootScope.$new();

        scope.close = close;
        scope.convertRnr = convertRnr;

        this.show = show;
        this.close = close;


        /**
         * @ngdoc function
         * @name show
         * @methodOf openlmis.requisitions.ConvertToOrderModal
         * @param {Object} requisition Requisition for convert
         *
         * @description
         * Shows modal to convert requisition.
         *
         */
        function show(requisition) {
            deferred = $q.defer();

            scope.requisition = requisition;

            $q.all([
                getDepotsForRequisition(),
                $templateRequest('requisitions/requisition/convert-to-order-modal/convert-to-order-modal.html')
            ]).then(function(result) {
                var depots = result[0],
                    template = result[1];

                scope.requisitionWithDepots = depots;

                $ngBootbox.customDialog({
                    title: scope.requisition.program.name + ' (' + scope.requisition.facility.type.name +
                           '): ' + messageService.get('label.convert.requisition.to.order'),
                    message: $compile(angular.element(template))(scope),
                    className: 'convert-to-order-modal'
                });
            });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name close
         * @methodOf openlmis.requisitions.ConvertToOrderModal
         *
         * @description
         * Close modal.
         *
         */
        function close() {
            $ngBootbox.hideAll();
            deferred.reject();
        }

        /**
         * @ngdoc function
         * @name convertRnr
         * @methodOf openlmis.requisitions.ConvertToOrderModal
         *
         * @description
         * Converts given requisition into order and then reload page.
         *
         */
        function convertRnr(){
            RequisitionService.convertToOrder([scope.requisitionWithDepots]).then($state.reload);
        }

        /**
         * @ngdoc function
         * @name getDepotsForRequisition
         * @methodOf openlmis.requisitions.ConvertToOrderModal
         *
         * @description
         * Get depots for current requisition.
         *
         */
        function getDepotsForRequisition() {
            LoadingModalService.open();
            RequisitionService.forConvert({
                filterBy: $stateParams.filterBy,
                filterValue: $stateParams.filterValue,
                sortBy: $stateParams.sortBy,
                descending: $stateParams.descending
            }).then(function(requisitions){
                requisitions.forEach(function(rnr) {
                    if (rnr.requisition.id == scope.requisition.id) {
                        deferred.resolve(rnr);
                    }
                });
            }).finally(function() {
                LoadingModalService.close();
            });

            return deferred.promise;
        }
    }
})();