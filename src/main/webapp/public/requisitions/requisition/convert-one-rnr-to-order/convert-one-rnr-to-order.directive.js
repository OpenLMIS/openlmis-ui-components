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
        .directive('convertOneRnrToOrder', convertOneRnrToOrder);

    convertOneRnrToOrder.$inject = ['$ngBootbox', 'messageService', '$compile', '$templateRequest'];

    function convertOneRnrToOrder($ngBootbox, messageService, $compile, $templateRequest) {

        var directive = {
            restrict: 'A',
            replace: true,
            controller: 'ConvertOneRnrToOrderCtrl',
            controllerAs: 'vm',
            templateUrl: 'requisitions/requisition/convert-one-rnr-to-order/convert-to-order-button.html',
            scope: {
                requisition: '=',
                requisitions: '='
            },
            link: link
        }

        return directive;

        function link(scope, element, attr, vm) {
            var dialog;

            vm.showModal = showModal;
            vm.hideModal = hideModal;

            function showModal() {
                getRequisitionWithDepots();
                $templateRequest('requisitions/requisition/convert-one-rnr-to-order/convert-one-rnr-to-order-modal.html')
                .then(function(modal) {
                    dialog = $ngBootbox.customDialog({
                        title: 'Convert Requisition about ' + scope.requisition.program.name +
                                ' (' + scope.requisition.facility.type.name + ')' + ' to order',
                        message: $compile(angular.element(modal))(scope),
                        className: 'convert-to-order-modal'
                    });
                });
            }

            function hideModal() {
                $ngBootbox.hideAll();
            }

            function getRequisitionWithDepots() {
                scope.requisitions.forEach(function(rnr) {
                    if (rnr.requisition.id == scope.requisition.id) {
                        vm.requisitionWithDepots = rnr;
                    }
                });
            }
        }
    }
})();