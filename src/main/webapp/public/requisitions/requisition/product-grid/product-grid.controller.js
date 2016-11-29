(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .controller('ProductGridCtrl', productGridCtrl);

    productGridCtrl.$inject = ['$scope', '$stateParams', '$filter', 'calculations', 'bootbox',
                               '$rootScope', '$templateRequest', '$compile',
                               'requisitionValidator'];

    function productGridCtrl($scope, $stateParams, $filter, calculations, bootbox, $rootScope,
                             $templateRequest, $compile, requisitionValidator) {

        $scope.nonFullSupply = $stateParams.nonFullSupply;
        $scope.getCategories = getCategories;
        $scope.gridVisible = gridVisible;
        $scope.hideLineItem = hideLineItem;
        $scope.isLineItemValid = requisitionValidator.isLineItemValid;

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
