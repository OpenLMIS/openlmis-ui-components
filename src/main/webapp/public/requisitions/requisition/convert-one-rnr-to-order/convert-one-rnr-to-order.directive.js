(function(){
    "use strict";

    /**
     *
     * @ngdoc directive
     * @name openlmis.requisitions.ConvertToOrder
     * @description
     * Service allows to display confirm modal with custom message.
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
                facilities: '='
            },
            link: link
        }

        return directive;

        function link(scope, element, attr, vm) {
            var dialog;

            vm.showModal = showModal;
            vm.hideModal = hideModal;

            function showModal() {
                $templateRequest('requisitions/requisition/convert-one-rnr-to-order/convert-one-rnr-to-order-modal.html')
                .then(function(modal) {
                    dialog = $ngBootbox.customDialog({
                        title: 'Convert Requisition about ' + scope.requisition.program.name + '(' + scope.requisition.facility.type.name + ')' + ' to order',
                        message: $compile(angular.element(modal))(scope),
                        className: 'convert-to-order-modal'
                    });
                });
            }

            function hideModal() {
                $ngBootbox.hideAll();
            }
        }
    }
})();