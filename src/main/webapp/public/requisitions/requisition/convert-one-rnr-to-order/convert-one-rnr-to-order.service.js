(function(){
    "use strict";

    /**
     *
     * @ngdoc directive
     * @name openlmis.requisitions.ConvertToOrder
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

        function show(requisition) {
            deferred = $q.defer();

            scope.requisition = requisition;

            getRequisitionWithDepots();

            $templateRequest('requisitions/requisition/convert-one-rnr-to-order/convert-one-rnr-to-order-modal.html')
            .then(function(template) {
                $ngBootbox.customDialog({
                    title: 'Convert Requisition about ' + scope.requisition.program.name +
                            ' (' + scope.requisition.facility.type.name + ')' + ' to order',
                    message: $compile(angular.element(template))(scope),
                    className: 'convert-to-order-modal'
                });
            });

            return deferred.promise;
        }

        function close() {
            $ngBootbox.hideAll();
            deferred.reject();
        }

        function convertRnr(){
            var requisitions = [];
            requisitions.push(scope.requisitionWithDepots);
            RequisitionService.convertToOrder(requisitions).then(reloadState);
        }

        function reloadState() {
            $state.reload();
        }

        function getRequisitionWithDepots() {
            LoadingModalService.open();
            var promise = RequisitionService.forConvert({
                filterBy: $stateParams.filterBy,
                filterValue: $stateParams.filterValue,
                sortBy: $stateParams.sortBy,
                descending: $stateParams.descending
            }).then(function(requisitions){
                requisitions.forEach(function(rnr) {
                    if (rnr.requisition.id == scope.requisition.id) {
                        scope.requisitionWithDepots = rnr;
                        LoadingModalService.close();
                    }
                });
            });
        }
    }
})();