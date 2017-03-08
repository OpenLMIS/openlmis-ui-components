/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-non-full-supply.controller:AddProductModalController
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
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:AddProductModalController
         * @name close
         *
         * @description
         * Closes add product modal and rejects modal promise.
         */
        function close() {
            $ngBootbox.hideAll();
            deferred.reject();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:AddProductModalController
         * @name addProduct
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
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:AddProductModalController
         * @name categoryVisible
         *
         * @description
         * Indicates if category should be displayed on modal.
         *
         * @param   {Object}  category One of categories on the list
         * @return {Boolean}          if category is visible
         */
        function categoryVisible(category) {
            var visible = false;
            angular.forEach(category.products, function(product) {
                visible = visible || product.$visible === undefined || product.$visible;
            });
            return visible;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:AddProductModalController
         * @name productVisible
         *
         * @description
         * Indicates if product should be displayed on modal.
         *
         * @param   {Object}  category One of products on the list
         * @return {Boolean}          if product is visible
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
