(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .controller('ProductGridCtrl', productGridCtrl);

    productGridCtrl.$inject = ['$scope', '$filter', 'CalculationFactory', 'bootbox', '$rootScope', '$templateRequest', '$compile'];

    function productGridCtrl($scope, $filter, CalculationFactory, bootbox, $rootScope, $templateRequest, $compile) {

        var dialog;

        $scope.getTotalLossesAndAdjustments = getTotalLossesAndAdjustments;
        $scope.showLossesAndAdjustments = showLossesAndAdjustments;

        $scope.ngModel.$getColumnTemplates().then(function(columnTemplates) {
            $scope.columns = columnTemplates;
            $scope.visibleColumns = [];
            angular.forEach($scope.columns, function(column) {
                if (column.display) {
                    $scope.visibleColumns.push(column);
                }
            })
        }).finally(function() {
            $scope.templateLoaded = true;
        });

        $scope.ngModel.$getStockAdjustmentReasons().then(function(stockAdjustmentReasons) {
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

            $templateRequest('requisitions/product-grid/losses-and-adjustments.html').then(function(html){
                dialog = bootbox.dialog({
                    message: $compile(html)(scope),
                    backdrop: true,
                    onEscape: true,
                    closeButton: false,
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
             })
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

    }
})();