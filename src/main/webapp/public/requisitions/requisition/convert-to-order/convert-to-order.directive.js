(function(){
    "use strict";

    /**
     *
     * @ngdoc service
     * @name openlmis.requisitions.ConvertToOrder
     * @description
     * Service allows to display confirm modal with custom message.
     *
     */

    angular.module('openlmis.requisitions')
        .directive('convertToOrder', convertToOrder);

    convertToOrder.$inject = ['$ngBootbox', 'messageService', '$compile', '$templateRequest'];

    function convertToOrder($ngBootbox, messageService, $compile, $templateRequest) {

        var directive = {
            restrict: 'AE',
            scope: {
                requisition: '=requisition',
                facilities: '=facilities'
            },
            link: link
        }

        return directive;

        function link(scope, element) {
            var dialog;

            element.on('click', showModal);

            function showModal() {
                $templateRequest('requisitions/requisition/convert-to-order/convert-modal.html')
                .then(function(template) {
                    dialog = $ngBootbox.customDialog({
                        title: 'Convert Requisition about ' + scope.requisition.program.name + '(' + scope.requisition.facility.type.name + ')' + ' to order',
                        message: $compile(angular.element(template))(scope),
                        className: 'convert-to-order-modal'
                    });
                });
            }
        }
    }
})();