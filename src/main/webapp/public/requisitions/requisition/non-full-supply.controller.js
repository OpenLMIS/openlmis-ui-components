(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis.requisitions.NonFullSupplyCtrl
     *
     * @description
     * Responsible for managing product grid for non full supply products.
     */
    angular
        .module('openlmis.requisitions')
        .controller('NonFullSupplyCtrl', nonFullSupplyCtrl);

    nonFullSupplyCtrl.$inject = ['requisition', 'requisitionValidator', 'AddProductModalService',
                                 'LineItem'];

    function nonFullSupplyCtrl(requisition, requisitionValidator, AddProductModalService,
                               LineItem) {

        var vm = this;

        vm.deleteLineItem = deleteLineItem;
        vm.addProduct = addProduct;
        vm.displayDeleteColumn = displayDeleteColumn;

        /**
         * @ngdoc method
         * @methodOf openlmis.requisitions.NonFullSupplyCtrl
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
         * @ngdoc property
         * @propertyOf openlmis.requisitions.NonFullSupplyCtrl
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and fullSupply states.
         */
        vm.requisition = requisition;

        /**
         * @ngdoc property
         * @propertyOf openlmis.requisitions.NonFullSupplyCtrl
         * @name displayAddProductButton
         * @type {Boolean}
         *
         * @description
         * Flag reponsible for hiding/showing the Add Product button.
         */
        vm.displayAddProductButton = !vm.requisition.$isApproved() && !vm.requisition.$isAuthorized();

        /**
         * @ngdoc property
         * @propertyOf openlmis.requisitions.NonFullSupplyCtrl
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = vm.requisition.$template.getColumns(true);

        /**
         * @ngdoc property
         * @propertyOf openlmis.requisitions.NonFullSupplyCtrl
         * @name lineItems
         * @type {Array}
         *
         * @description
         * The list of all line items.
         */
        vm.lineItems = vm.requisition.requisitionLineItems;

        /**
         * @ngdoc method
         * @methodOf openlmis.requisitions.NonFullSupplyCtrl
         * @name deleteLineItem
         *
         * @description
         * Deletes the given line item, removing it from the grid and returning the product to the
         * list od approved products.
         *
         * @param  {Object} lineItem   the line item to be deleted
         */
        function deleteLineItem(lineItem) {
            var id = vm.lineItems.indexOf(lineItem);
            if (id > -1) {
                vm.lineItems[id].orderableProduct.$visible = true;
                vm.lineItems.splice(id, 1);
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis.requisitions.NonFullSupplyCtrl
         * @name addProduct
         *
         * @description
         * Opens modal that let the user add new product to the grid.
         */
        function addProduct() {
            AddProductModalService.show(vm.requisition.$approvedCategories)
                .then(function(lineItem) {
                    vm.requisition.requisitionLineItems.push(
                        new LineItem(lineItem, vm.requisition)
                    );
                });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis.requisitions.NonFullSupplyCtrl
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
            vm.lineItems.forEach(function(lineItem) {
                display = display || lineItem.$deletable;
            });
            return display;
        }
    }

})();
