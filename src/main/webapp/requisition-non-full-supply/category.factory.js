  (function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition-non-full-supply.categoryFactory
     *
     * @description
     * Responsible for grouping products into categories to be displayed on the Add Product modal.
     */
    angular
        .module('requisition-non-full-supply')
        .factory('categoryFactory', factory);

    factory.$inject = ['$filter'];

    function factory($filter) {
        var factory = {
            groupProducts: groupProducts
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.categoryFactory
         * @name groupProducts
         *
         * @description
         * Groups the given products into categories. Program with the given ID is used to group
         * the products.
         *
         * @param   {Array}     products    the list of products
         * @param   {String}    programId   the ID of the program
         * @return  {Array}                 the list of categories with related products
         */
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
