  (function() {

    'use strict';

    angular
        .module('requisition-non-full-supply')
        .factory('categoryFactory', factory);

    factory.$inject = ['$filter'];

    function factory($filter) {
        var factory = {
            groupProducts: groupProducts
        };
        return factory;

        function groupProducts(products, programId) {
            var categories = {};
            angular.forEach(products, function(product) {
                var category = getProgram(product, programId).productCategoryDisplayName;
                if (!categories[category]) {
                    categories[category] = [];
                }
                if (product.$visible === undefined) {
                    product.$visible = true;
                }
                categories[category].push(product);
            });
            return toList(categories);
        }

        function toList(categories) {
            var list = [];
            for (var category in categories) {
                list.push({
                    name: category,
                    products: categories[category]
                });
            }
            return list;
        }

        function getProgram(product, programId) {
            return $filter('filter')(product.programs, {
                programId: programId
            }, true)[0];
        }
    }

})();
