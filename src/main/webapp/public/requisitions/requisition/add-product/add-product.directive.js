(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .directive('addProduct', addProduct);

    addProduct.$inject = ['$ngBootbox', '$templateRequest', '$compile', '$timeout', 'messageService', 'LineItem'];

    function addProduct($ngBootbox, $templateRequest, $compile, $timeout, messageService, LineItem) {
        var directive = {
            restrict: 'AE',
            scope: {
                requisition: '=requisition'
            },
            link: link
        }
        return directive;

        function link(scope, element) {
            var dialog;

            element.on('click', openModal);

            scope.categoryVisible = categoryVisible;
            scope.productVisible = productVisible;
            scope.addProduct = addProduct;

            function openModal() {
                $templateRequest('requisitions/requisition/add-product/add-product-modal.html').then(function(template) {
                    resetForm();
                    dialog = $ngBootbox.customDialog({
                        title: messageService.get('label.rnr.add.non.full.supply'),
                        message: $compile(angular.element(template))(scope),
                        className: 'add-product-modal'
                    });
                });
            }

            function addProduct() {
                $timeout(function() {
                    $ngBootbox.hideAll();
                    scope.selectedProduct.$visible = false;
                    var lineItem = {
                      requestedQuantity: scope.requestedQuantity,
                      requestedQuantityExplanation: scope.requestedQuantityExplanation,
                      orderableProduct: scope.selectedProduct,
                      $hideable: true
                    }

                    scope.requisition.requisitionLineItems.push(
                        new LineItem(lineItem, scope.requisition)
                    );
                });
            }

            function categoryVisible(category) {
                return category.isVisible();
            }

            function productVisible(product) {
                return product.$visible;
            }

            function resetForm() {
                scope.selectedCategory = undefined;
                scope.selectedProduct = undefined;
                scope.requestedQuantity = undefined;
                scope.requestedQuantityExplanation = undefined;
            }

            function getCategoryByName(categories, name) {
                var match;
                categories.forEach(function(category) {
                    if (category.name === name) {
                        match = match || category;
                    }
                });
                return match;
            }
        }
    }

})();
