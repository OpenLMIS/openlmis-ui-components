(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-full-supply.FullSupplyController
     *
     * @description
     * Responsible for managing product grid for full supply products.
     */
    angular
        .module('requisition-full-supply')
        .controller('FullSupplyController', controller);

    controller.$inject = ['requisition', 'requisitionValidator', '$filter', 'TEMPLATE_COLUMNS'];

    function controller(requisition, requisitionValidator, $filter, TEMPLATE_COLUMNS) {

        var vm = this;

        vm.skipAll = skipAll;
        vm.unskipAll = unskipAll;
        vm.isColumnSkip = isColumnSkip;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and nonFullSupply states.
         */
        vm.requisition = requisition;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyController
         * @name categories
         * @type {Object}
         *
         * @description
         * Holds list of line items grouped by category.
         */
        vm.categories = groupByCategory(vm.requisition.requisitionLineItems);

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyController
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
         * @methodOf requisition-full-supply.FullSupplyController
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

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
         * @name skipAll
         *
         * @description
         * Sets all line items that are skippable from a requisition as skipped.
         */
        function skipAll() {
            setSkipAll(true);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
         * @name unskipAll
         *
         * @description
         * Sets all line items from a requisition as not skipped.
         */
        function unskipAll() {
            setSkipAll(false);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
         * @name isColumnSkip
         *
         * @description
         * Determines wheter column name is 'skipped'.
         * @return {Boolean} true is column name is 'skipped'
         */
        function isColumnSkip(column) {
            return column.name === TEMPLATE_COLUMNS.SKIPPED;
        }

        function setSkipAll(value) {
            getLineItems().forEach(function(lineItem) {
                if (lineItem.canBeSkipped(vm.requisition)) {
                    lineItem.skipped = value;
                }
            });
        }

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

        function getLineItems() {
            return $filter('filter')(vm.requisition.requisitionLineItems, {
                $program: {
                    fullSupply:true
                }
            });
        }
    }

})();
