(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-non-full-supply.NonFullSupplyController
     *
     * @description
     * Responsible for managing product grid for non full supply products.
     */
    angular
        .module('requisition-non-full-supply')
        .controller('NonFullSupplyController', nonFullSupplyCtrl);

    nonFullSupplyCtrl.$inject = ['requisition', 'requisitionValidator', 'addProductModalService', 'LineItem', '$filter', 'lineItems', 'paginatedListFactory', '$state'];

    function nonFullSupplyCtrl(requisition, requisitionValidator, addProductModalService, LineItem, $filter, lineItems, paginatedListFactory, $state) {

        var vm = this;

        vm.deleteLineItem = deleteLineItem;
        vm.addProduct = addProduct;
        vm.displayDeleteColumn = displayDeleteColumn;
        vm.changePage = changePage;
        vm.isPageValid = isPageValid;

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
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
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and fullSupply states.
         */
        vm.requisition = requisition;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyController
         * @name paginatedLineItems
         * @type {Object}
         *
         * @description
         * Holds line items divided into pages with properties like current page etc.
         */
        vm.paginatedLineItems = lineItems;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyController
         * @name lineItems
         * @type {Object}
         *
         * @description
         * Holds list of line items grouped by category.
         */
        vm.lineItems = vm.paginatedLineItems.items[vm.paginatedLineItems.currentPage - 1];

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyController
         * @name displayAddProductButton
         * @type {Boolean}
         *
         * @description
         * Flag reponsible for hiding/showing the Add Product button.
         */
        vm.displayAddProductButton = !vm.requisition.$isApproved() && !vm.requisition.$isAuthorized();

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyController
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = vm.requisition.template.getColumns(true);

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name deleteLineItem
         *
         * @description
         * Deletes the given line item, removing it from the grid and returning the product to the
         * list od approved products.
         *
         * @param  {Object} lineItem   the line item to be deleted
         */
        function deleteLineItem(lineItem) {
            var id = vm.requisition.requisitionLineItems.indexOf(lineItem);
            if (id > -1) {
                makeProductVisible(vm.requisition.requisitionLineItems[id].orderableProduct.name);
                vm.requisition.requisitionLineItems.splice(id, 1);
                reloadLineItems();
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name addProduct
         *
         * @description
         * Opens modal that lets the user add new product to the grid.
         */
        function addProduct() {
            addProductModalService.show(vm.requisition.$approvedCategories)
                .then(function(lineItem) {
                    lineItem.orderableProduct.programs = [{
                        programId: vm.requisition.program.id,
                        fullSupply: false
                    }];
                    vm.requisition.requisitionLineItems.push(
                        new LineItem(lineItem, vm.requisition)
                    );
                    reloadLineItems();
                })
                .catch(function(){
                    // don't do anything
                });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name displayDeleteColumn
         *
         * @description
         * Checks whether the delete column should be displayed. The column is visible only if any
         * of the line items is deletable.
         *
         * @return {Boolean} true if the delete column should be displayed, false otherwise
         */
        function displayDeleteColumn() {
            var display = false;
            vm.requisition.requisitionLineItems.forEach(function(lineItem) {
                display = display || lineItem.$deletable;
            });
            return display;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name changePage
         *
         * @description
         * Loads line items when page is changed.
         *
         * @param {integer} newPage new page number
         */
        function changePage(newPage) {
            vm.lineItems = vm.paginatedLineItems.items[newPage - 1];
            $state.go('requisitions.requisition.nonFullSupply', {
                rnr: vm.requisition.id,
                page: newPage
            }, {
                notify: false
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
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
            angular.forEach(vm.paginatedLineItems.items[pageNumber - 1], function(lineItem) {
                if(!vm.isLineItemValid(lineItem)) valid = false;
            });
            return valid;
        }

        function makeProductVisible(productName) {
            angular.forEach(vm.requisition.$approvedCategories, function(category) {
                angular.forEach(category.lineItems, function(lineItem) {
                    if(lineItem.productName === productName) lineItem.$visible = true;
                });
            });
        }

        function reloadLineItems() {
            var items = $filter('filter')(vm.requisition.requisitionLineItems, {
                $program: {
                    fullSupply:false
                }
            });

            items = $filter('orderBy')(items, '$program.productCategoryDisplayName');
            vm.paginatedLineItems = paginatedListFactory.getPaginatedItems(items, vm.paginatedLineItems.currentPage);
            vm.lineItems = vm.paginatedLineItems.items[vm.paginatedLineItems.currentPage - 1];
        }
    }

})();
