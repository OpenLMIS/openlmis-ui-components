(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .controller('ProductGridCtrl', productGridCtrl);

    productGridCtrl.$inject = ['$scope', '$stateParams', '$filter', 'CalculationFactory', 'bootbox', '$rootScope', '$templateRequest', '$compile'];

    function productGridCtrl($scope, $stateParams, $filter, CalculationFactory, bootbox, $rootScope, $templateRequest, $compile) {

        var dialog;

        $scope.getTotalLossesAndAdjustments = getTotalLossesAndAdjustments;
        $scope.showLossesAndAdjustments = showLossesAndAdjustments;
        $scope.nonFullSupply = $stateParams.nonFullSupply;
        $scope.getCategories = getCategories;
        $scope.gridVisible = gridVisible;
        $scope.hideLineItem = hideLineItem;

        $scope.requisition.$getStockAdjustmentReasons().then(function(stockAdjustmentReasons) {
            $scope.stockAdjustmentReasons = stockAdjustmentReasons;
        });

        function showLossesAndAdjustments(lineItem) {
            var scope = $rootScope.$new();

            $scope.currentRnrLineItem = lineItem;
            if (!$scope.currentRnrLineItem.stockAdjustments) {
                $scope.currentRnrLineItem.stockAdjustments = [];
            }
            $scope.adjustment = {};

            scope.closeLossesAndAdjustmentModal = closeLossesAndAdjustmentModal;
            scope.addAdjustment = addAdjustment;
            scope.removeAdjustment = removeAdjustment;
            scope.getReasonName = getReasonName;
            scope.updateTotalLossesAndAdjustments = updateTotalLossesAndAdjustments;
            scope.stockAdjustmentReasons = $scope.stockAdjustmentReasons;
            scope.currentRnrLineItem = $scope.currentRnrLineItem;
            scope.adjustment = $scope.adjustment

            $templateRequest('requisitions/requisition/losses-and-adjustments/losses-and-adjustments.html').then(function(html){
                dialog = bootbox.dialog({
                    message: $compile(html)(scope),
                    backdrop: true,
                    onEscape: true,
                    closeButton: true,
                    size: 'large'
                });
            });
            $scope.$watch('currentRnrLineItem.stockAdjustments', updateTotalLossesAndAdjustments, true);
        }

        function closeLossesAndAdjustmentModal() {
            dialog.modal('hide');
        }

        function addAdjustment() {
            $scope.currentRnrLineItem.stockAdjustments.push({
                 'reasonId': $scope.adjustment.reason.item.id,
                 'quantity': $scope.adjustment.quantity
             });
        }

        function removeAdjustment(adjustment) {
            var index = $scope.currentRnrLineItem.stockAdjustments.indexOf(adjustment);
            $scope.currentRnrLineItem.stockAdjustments.splice(index, 1);
        }

        function getReasonName(reasonId) {
            var reason = $filter('filter')($scope.stockAdjustmentReasons, {id: reasonId}, true);
            if (!!reason) {
                return reason[0].name;
            }
        }

        function getTotalLossesAndAdjustments(lineItem) {
            if (!lineItem.totalLossesAndAdjustments) {
                return 0;
            }
            return lineItem.totalLossesAndAdjustments;
        }

        function updateTotalLossesAndAdjustments() {
            $scope.currentRnrLineItem.totalLossesAndAdjustments = CalculationFactory.totalLossesAndAdjustments(
                $scope.currentRnrLineItem, $scope.stockAdjustmentReasons
            );
        }

        function hideLineItem(category, lineItem) {
            var id = category.lineItems.indexOf(lineItem);
            category.lineItems[id].orderableProduct.$visible = true;
            category.lineItems.splice(id, 1);
        }

        function gridVisible() {
            return !$scope.nonFullSupply || $scope.requisition.$nonFullSupplyCategories.length;
        }

        function getCategories() {
            return $scope.nonFullSupply ? $scope.requisition.$nonFullSupplyCategories : $scope.requisition.$fullSupplyCategories;
        }

    }
})();
