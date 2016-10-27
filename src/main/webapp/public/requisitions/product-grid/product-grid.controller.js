(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .controller('ProductGridCtrl', productGridCtrl);

  productGridCtrl.$inject = ['$scope', '$filter', 'CalculationFactory'];

  function productGridCtrl($scope, $filter, CalculationFactory) {

    $scope.lossesAndAdjustmentsModal = false;

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
    })

    $scope.showLossesAndAdjustments = function (lineItem) {
        $scope.currentRnrLineItem = lineItem;
        $scope.adjustment = {};
        $scope.lossesAndAdjustmentsModal = true;
    };

    $scope.closeLossesAndAdjustmentModal = function () {
        $scope.lossesAndAdjustmentsModal = false;
    };

    $scope.addAdjustment = function() {
        if (!$scope.currentRnrLineItem.stockAdjustments) {
            $scope.currentRnrLineItem.stockAdjustments = [];
        }
        $scope.currentRnrLineItem.stockAdjustments.push({
            'reasonId': $scope.adjustment.reason.id,
            'quantity': $scope.adjustment.quantity
        })
        $scope.updateTotalLossesAndAdjustments();
    };

    $scope.removeAdjustment = function(adjustment) {
        var index = $scope.currentRnrLineItem.stockAdjustments.indexOf(adjustment);
        $scope.currentRnrLineItem.stockAdjustments.splice(index, 1);
        $scope.updateTotalLossesAndAdjustments();
    };

    $scope.getReasonName = function(reasonId) {
      var reason = $filter('filter')($scope.stockAdjustmentReasons, {id: reasonId}, true);
      if (!!reason) {
        return reason[0].name;
      }
    }

    $scope.getTotalLossesAndAdjustments = function(lineItem) {
        if (!lineItem.totalLossesAndAdjustments) {
            return 0;
        }
        return lineItem.totalLossesAndAdjustments;
    }

    $scope.updateTotalLossesAndAdjustments = function() {
      $scope.currentRnrLineItem.totalLossesAndAdjustments = CalculationFactory.totalLossesAndAdjustments(
        $scope.currentRnrLineItem, $scope.stockAdjustmentReasons
      );
    }

  }

})();