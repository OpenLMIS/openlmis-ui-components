(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-non-full-supply.NonFullSupplyCtrl
     *
     * @description
     * Responsible for managing product grid for non full supply products.
     */
    angular
        .module('requisition-non-full-supply')
        .controller('NonFullSupplyCtrl', nonFullSupplyCtrl);

    nonFullSupplyCtrl.$inject = ['requisition', 'requisitionValidator', 'AddProductModalService',
                                 'LineItem', '$filter'];

    function nonFullSupplyCtrl(requisition, requisitionValidator, AddProductModalService,
                               LineItem, $filter) {

        var vm = this;

        vm.deleteLineItem = deleteLineItem;
        vm.addProduct = addProduct;
        vm.displayDeleteColumn = displayDeleteColumn;
        vm.getLineItems = getLineItems;

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyCtrl
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
         * @propertyOf requisition-non-full-supply.NonFullSupplyCtrl
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and fullSupply states.
         */
        vm.requisition = requisition;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyCtrl
         * @name displayAddProductButton
         * @type {Boolean}
         *
         * @description
         * Flag reponsible for hiding/showing the Add Product button.
         */
        vm.displayAddProductButton = !vm.requisition.$isApproved() && !vm.requisition.$isAuthorized();

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyCtrl
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = vm.requisition.$template.getColumns(true);

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyCtrl
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
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyCtrl
         * @name addProduct
         *
         * @description
         * Opens modal that lets the user add new product to the grid.
         */
        function addProduct() {
            AddProductModalService.show(vm.requisition.$approvedCategories)
                .then(function(lineItem) {
                    lineItem.orderableProduct.programs = [{
                        programId: vm.requisition.program.id,
                        fullSupply: false
                    }];
                    vm.requisition.requisitionLineItems.push(
                        new LineItem(lineItem, vm.requisition)
                    );
                })
                .catch(function(){
                    // don't do anything
                });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyCtrl
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
         * @methodOf requisition-non-full-supply.NonFullSupplyCtrl
         * @name getLineItems
         *
         * @description
         * Filters the list of all line items and returns only those that are non full supply ones.
         *
         * @return  {List}  the filtered list of line items
         */
        function getLineItems() {
            return $filter('filter')(vm.requisition.requisitionLineItems, {
                $program: {
                    fullSupply:false
                }
            });
        }

        function makeProductVisible(productName) {
            angular.forEach(vm.requisition.$approvedCategories, function(category) {
                angular.forEach(category.lineItems, function(lineItem) {
                    if(lineItem.productName === productName) lineItem.$visible = true;
                });
            });
        }
    }

})();
