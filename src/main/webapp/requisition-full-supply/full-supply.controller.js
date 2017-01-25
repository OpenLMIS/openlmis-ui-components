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

    controller.$inject = ['requisition', 'lineItems', 'requisitionValidator', '$filter', 'TEMPLATE_COLUMNS', '$state'];

    function controller(requisition, lineItems, requisitionValidator, $filter, TEMPLATE_COLUMNS, $state) {

        var vm = this;

        vm.skipAll = skipAll;
        vm.unskipAll = unskipAll;
        vm.isSkipColumn = isSkipColumn;
        vm.isPageValid = isPageValid;
        vm.changePage = changePage;

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
         * @name paginatedLineItems
         * @type {Object}
         *
         * @description
         * Holds line items divided into pages with properties like current page etc.
         */
        vm.paginatedLineItems = lineItems;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyController
         * @name lineItems
         * @type {Object}
         *
         * @description
         * Holds list of line items grouped by category.
         */
        vm.lineItems = vm.paginatedLineItems.items[vm.paginatedLineItems.currentPage - 1];

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyController
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = vm.requisition.template.getColumns();

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
         * @param  {Object}  lineItem the line item to be checked
         * @return {Boolean}          true if any of the fields has error, false otherwise
         */
        vm.isLineItemValid = requisitionValidator.isLineItemValid;

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
         * @name changePage
         *
         * @description
         * Loads line items when page is changed.
         *
         * @param {integer} newPage new page number
         */
        function changePage(newPage) {
            vm.lineItems = vm.paginatedLineItems.items[newPage - 1];
            $state.go('requisitions.requisition.fullSupply', {
                rnr: vm.requisition.id,
                page: newPage
            }, {
                notify: false
            });
        }

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
         * @name isSkipColumn
         *
         * @description
         * Determines whether column name is 'skipped'.
         * @return {Boolean} true if column name is 'skipped'
         */
        function isSkipColumn(column) {
            return column.name === TEMPLATE_COLUMNS.SKIPPED;
        }

        function setSkipAll(value) {
            angular.forEach(vm.paginatedLineItems.items, function(page) {
                angular.forEach(page, function(lineItem) {
                    if (lineItem.canBeSkipped(vm.requisition)) {
                        lineItem.skipped = value;
                    }
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
         * @name isPageValid
         *
         * @description
         * Validates all line items that are present on page.
         *
         * @param {integer} pageNumber number of page to valid
         * @return {Boolean} true when all page line items are valid
         */
        function isPageValid(pageNumber) {
            var valid = true;
            angular.forEach(vm.paginatedLineItems[pageNumber - 1], function(lineItem) {
                if(!vm.isLineItemValid(lineItem)) valid = false;
            });
            return valid;
        }
    }

})();
