(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis.requisitions.AddProductModalService
     *
     * @description
     * It shows modal with possibility to add non-full supplly line item
     * with one of given products.
     */
    angular
        .module('requisition-non-full-supply')
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

        /**
         * @ngdoc function
         * @name show
         * @methodOf openlmis.requisitions.AddProductModalService
         *
         * @description
         * Shows modal that allows to add line item to requisition.
         *
         * @param {Array} categories Facility approved categories
         * @returns {Promise} resolved with line item when product is added
         */
        function show(categories) {
            deferred = $q.defer();

            scope.categories = categories;
            scope.selectedCategory = undefined;
            scope.selectedProduct = undefined;
            scope.requestedQuantity = undefined;
            scope.requestedQuantityExplanation = undefined;

            $templateRequest('requisition-non-full-supply/add-product-modal.html')
                .then(function(template) {
                    $ngBootbox.customDialog({
                        title: messageService.get('label.rnr.add.non.full.supply'),
                        message: $compile(angular.element(template))(scope),
                        className: 'add-product-modal'
                    });
                });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name close
         * @methodOf openlmis.requisitions.AddProductModalService
         *
         * @description
         * Closes add product modal and rejects modal promise.
         */
        function close() {
            $ngBootbox.hideAll();
            deferred.reject();
        }

        /**
         * @ngdoc function
         * @name addProduct
         * @methodOf openlmis.requisitions.AddProductModalService
         *
         * @description
         * Resolves promise with line item created from parameters.
         *
         * @param {Object} product Selected product
         * @param {Integer} quantity Entered quantity of product
         * @param {String} explanation Explanation for quantity of product
         */
        function addProduct(product, quantity, explanation) {
            $ngBootbox.hideAll();
            product.$visible = false;

            deferred.resolve({
                requestedQuantity: quantity,
                requestedQuantityExplanation: explanation,
                orderableProduct: convertToOrderableProduct(product),
                $deletable: true
            });
        }

        /**
         * @ngdoc function
         * @name categoryVisible
         * @methodOf openlmis.requisitions.AddProductModalService
         *
         * @description
         * Indicates if category should be displayed on modal
         *
         * @param {Object} category One of categories on the list
         * @returns {Boolean} if category is visible
         */
        function categoryVisible(category) {
            return category.isVisible();
        }

        /**
         * @ngdoc function
         * @name productVisible
         * @methodOf openlmis.requisitions.AddProductModalService
         *
         * @description
         * Indicates if product should be displayed on modal
         *
         * @param {Object} category One of products on the list
         * @returns {Boolean} if product is visible
         */
        function productVisible(product) {
            return product.$visible;
        }

        function convertToOrderableProduct(product) {
            return {
                id: product.productId,
                name: product.productName,
                productCode: product.productCode,
                $program: {
                    productCategoryDisplayName: product.productCategoryDisplayName,
                    fullSupply: product.fullSupply
                }
            }
        }
    }

})();
