(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .service('AddProductModalService', service);

    service.$inject = ['$q', '$rootScope', '$compile', '$templateRequest', '$ngBootbox',
        'messageService'
    ];

    function service($q, $rootScope, $compile, $templateRequest, $ngBootbox, messageService) {

        var deferred, scope = $rootScope.$new();

        scope.categoryVisible = categoryVisible;
        scope.productVisible = productVisible;
        scope.addProduct = addProduct;
        scope.close = close;

        this.show = show;
        this.close = close;

        function show(categories) {
            deferred = $q.defer();

            scope.categories = categories;
            scope.selectedCategory = undefined;
            scope.selectedProduct = undefined;
            scope.requestedQuantity = undefined;
            scope.requestedQuantityExplanation = undefined;

            $templateRequest('requisitions/requisition/add-product/add-product-modal.html')
                .then(function(template) {
                    $ngBootbox.customDialog({
                        title: messageService.get('label.rnr.add.non.full.supply'),
                        message: $compile(angular.element(template))(scope),
                        className: 'add-product-modal'
                    });
                });

            return deferred.promise;
        }

        function close() {
            $ngBootbox.hideAll();
            deferred.reject();
        }

        function addProduct(product, quantity, explanation) {
            $ngBootbox.hideAll();
            product.$visible = false;

            deferred.resolve({
                requestedQuantity: quantity,
                requestedQuantityExplanation: explanation,
                orderableProduct: product,
                $deletable: true
            });
        }

        function categoryVisible(category) {
            return category.isVisible();
        }

        function productVisible(product) {
            return product.$visible;
        }

    }

})();
