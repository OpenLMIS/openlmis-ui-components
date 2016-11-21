(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .factory('CategoryFactory', categoryFactory);

    categoryFactory.$inject = ['Category'];

    function categoryFactory(Category) {
        var factory = {
            groupFullSupplyLineItems: groupFullSupplyLineItems,
            groupNonFullSupplyLineItems: groupNonFullSupplyLineItems,
            groupProducts: groupProducts
        };
        return factory;

        function groupFullSupplyLineItems(lineItems, programId) {
            return groupLineItemsWithCondition(lineItems, programId, function(lineItem) {
                return isFullSupply(lineItem, programId);
            });
        }

        function groupNonFullSupplyLineItems(lineItems, programId) {
            return groupLineItemsWithCondition(lineItems, programId, function(lineItem) {
                return !isFullSupply(lineItem, programId);
            });
        }

        function groupProducts(lineItems, products) {
            var categories = {};

            products.forEach(function(product) {
                var category = product.product.productCategory.displayName;
                if (!isLineItem(lineItems, product)) {
                    if (!categories[category]) {
                        categories[category] = [];
                    }
                    categories[category].push(product.product.product);
                    product.product.product.$visible = true;
                }
            });

            return toCategoryList(categories);
        }

        function groupLineItemsWithCondition(lineItems, programId, condition) {
            var categories = {};

            lineItems.forEach(function(lineItem) {
                if (condition(lineItem)) {
                    var category = getCategory(lineItem, programId);
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
                list.push(new Category(category, categories[category]));
            }
            return list;
        }

        function getCategory(lineItem, programId) {
            var program = getProgramById(lineItem.orderableProduct.programs, programId);
            return program ? program.productCategoryDisplayName : undefined;
        }

        function isFullSupply(lineItem, programId) {
            var program = getProgramById(lineItem.orderableProduct.programs, programId);
            return program ? program.fullSupply : undefined;
        }

        function getProgramById(programs, programId) {
            var match;
            programs.forEach(function(program) {
                if (program.programId === programId) {
                    match = program;
                }
            });
            return match;
        }

        function isLineItem(lineItems, product) {
            var isLineItem = false;
            lineItems.forEach(function(lineItem) {
                isLineItem = isLineItem || (lineItem.orderableProduct.id === product.product.product.id);
            });
            return isLineItem;
        }
    }
})();
