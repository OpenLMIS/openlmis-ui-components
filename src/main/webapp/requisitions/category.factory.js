(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .factory('CategoryFactory', categoryFactory);

    categoryFactory.$inject = ['RequisitionCategory'];

    function categoryFactory(RequisitionCategory) {
        var factory = {
            groupFullSupplyLineItems: groupFullSupplyLineItems,
            groupNonFullSupplyLineItems: groupNonFullSupplyLineItems,
            groupProducts: groupProducts
        };
        return factory;

        function groupFullSupplyLineItems(lineItems) {
            return groupLineItemsWithCondition(lineItems, function(lineItem) {
                return lineItem.$program.fullSupply;
            });
        }

        function groupNonFullSupplyLineItems(lineItems) {
            return groupLineItemsWithCondition(lineItems, function(lineItem) {
                return !lineItem.$program.fullSupply;
            });
        }

        function groupProducts(lineItems, products) {
            var categories = {};

            products.forEach(function(product) {
                var category = product.product.productCategoryDisplayName;
                if (!isLineItem(lineItems, product)) {
                    if (!categories[category]) {
                        categories[category] = [];
                    }
                    categories[category].push(product.product);
                    product.product.$visible = true;
                }
            });

            return toCategoryList(categories);
        }

        function groupLineItemsWithCondition(lineItems, condition) {
            var categories = {};

            lineItems.forEach(function(lineItem) {
                if (condition(lineItem)) {
                    var category = lineItem.$program.productCategoryDisplayName;
                    if (!categories[category]) {
                        categories[category] = [];
                    }
                    categories[category].push(lineItem);
                }
            });

            return toCategoryList(categories);
        }

        function toCategoryList(categories) {
            var list = []
            for (var category in categories) {
                list.push(new RequisitionCategory(category, categories[category]));
            }
            return list;
        }

        function isLineItem(lineItems, product) {
            var isLineItem = false;
            lineItems.forEach(function(lineItem) {
                isLineItem = isLineItem || (lineItem.orderableProduct.id === product.product.productId);
            });
            return isLineItem;
        }
    }
})();
