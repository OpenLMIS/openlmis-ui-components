(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-non-full-supply.AddProductModalController
     *
     * @description
     * Manages Add Product Modal and provides method for checking categories/products visibility
     * and adding products.
     */
    angular
        .module('requisition-non-full-supply')
        .controller('AddProductModalController', controller);

    controller.$inject = ['$ngBootbox', '$filter', 'deferred', 'categories', 'programId'];

    function controller($ngBootbox, $filter, deferred, categories, programId) {
        var vm = this;

        vm.categoryVisible = categoryVisible;
        vm.productVisible = productVisible;
        vm.addProduct = addProduct;
        vm.close = close;

        vm.categories = categories;

        /**
         * @ngdoc function
         * @name close
         * @methodOf requisition-non-full-supply.AddProductModalController
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
         * @methodOf requisition-non-full-supply.AddProductModalController
         *
         * @description
         * Resolves promise with line item created from parameters.
         */
        function addProduct() {
            $ngBootbox.hideAll();
            vm.selectedProduct.$visible = false;

            deferred.resolve({
                requestedQuantity: vm.requestedQuantity,
                requestedQuantityExplanation: vm.requestedQuantityExplanation,
                pricePerPack: getProgram(vm.selectedProduct, programId).pricePerPack,
                orderable: vm.selectedProduct,
                $deletable: true
            });
        }

        /**
         * @ngdoc function
         * @name categoryVisible
         * @methodOf requisition-non-full-supply.AddProductModalController
         *
         * @description
         * Indicates if category should be displayed on modal
         *
         * @param {Object} category One of categories on the list
         * @returns {Boolean} if category is visible
         */
        function categoryVisible(category) {
            var visible = false;
            angular.forEach(category.products, function(product) {
                visible = visible || product.$visible === undefined || product.$visible;
            });
            return visible;
        }

        /**
         * @ngdoc function
         * @name productVisible
         * @methodOf requisition-non-full-supply.AddProductModalController
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
                id: product.id,
                name: product.name,
                productCode: product.productCode,
                packSize: product.packSize,
                $program: {
                    orderableCategoryDisplayName: getProgram(product, programId).orderableCategoryDisplayName,
                    fullSupply: product.fullSupply
                }
            };
        }

        function getProgram(product, programId) {
            return $filter('filter')(product.programs, {
                programId: programId
            }, true)[0];
        }
    }

})();
