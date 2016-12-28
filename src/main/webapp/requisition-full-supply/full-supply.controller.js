(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-full-supply.FullSupplyCtrl
     *
     * @description
     * Responsible for managing product grid for full supply products.
     */
    angular
        .module('requisition-full-supply')
        .controller('FullSupplyCtrl', fullSupplyCtrl);

    fullSupplyCtrl.$inject = ['requisition', 'requisitionValidator'];

    function fullSupplyCtrl(requisition, requisitionValidator) {
        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyCtrl
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and nonFullSupply states.
         */
        vm.requisition = requisition;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyCtrl
         * @name categories
         * @type {Object}
         *
         * @description
         * Holds list of line items grouped by category.
         */
        vm.categories = groupByCategory(vm.requisition.requisitionLineItems);

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyCtrl
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = vm.requisition.$template.getColumns();

        /**
         *
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyCtrl
         * @name isLineItemValid
         *
         * @description
         * Checks whether any field of the given line item has any error. It does not perform any
         * validation. It is an exposure of the isLineItemValid method of the requisitionValidator.
         *
         * @param  {Object}  lineItem the line item ot be checked
         * @return {Boolean}          true if any of the fields has error, false otherwise
         */
        vm.isLineItemValid = requisitionValidator.isLineItemValid;

        function groupByCategory(lineItems) {
            var categories = {};
            lineItems.forEach(function(lineItem) {
                if (lineItem.$program.fullSupply) {
                    var category = lineItem.$program.productCategoryDisplayName;
                    if (!categories[category]) {
                        categories[category] = [];
                    }
                    categories[category].push(lineItem);
                }
            });
            return categories;
        }
    }

})();
