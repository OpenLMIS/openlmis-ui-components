/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-non-full-supply.controller:NonFullSupplyController
     *
     * @description
     * Responsible for managing product grid for non full supply products.
     */
    angular
        .module('requisition-non-full-supply')
        .controller('NonFullSupplyController', nonFullSupplyController);

    nonFullSupplyController.$inject = [
        '$filter', 'addProductModalService', 'LineItem', 'requisitionValidator',
        'requisition', 'columns', 'allItems', '$state'
    ];

    function nonFullSupplyController($filter, addProductModalService, LineItem, requisitionValidator,
                                    requisition, columns, allItems, $state) {

        var vm = this;

        vm.deleteLineItem = deleteLineItem;
        vm.addProduct = addProduct;
        vm.displayDeleteColumn = displayDeleteColumn;
        vm.getTotalItems = getTotalItems;

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name isLineItemValid
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name items
         * @type {Array}
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
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name allItems
         * @type {Array}
         *
         * @description
         * Holds all requisition line items.
         */
        vm.allItems = allItems;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name items
         * @type {Array}
         *
         * @description
         * Holds all items that will be displayed.
         */
        vm.items = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and fullSupply states.
         */
        vm.requisition = requisition;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name displayAddProductButton
         * @type {Boolean}
         *
         * @description
         * Flag responsible for hiding/showing the Add Product button.
         */
        vm.displayAddProductButton = !vm.requisition.$isApproved() && !vm.requisition.$isAuthorized() &&
                                     !vm.requisition.$isInApproval() && !vm.requisition.$isReleased();

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = columns;

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name deleteLineItem
         *
         * @description
         * Deletes the given line item, removing it from the grid and returning the product to the
         * list of approved products.
         *
         * @param {Object} lineItem the line item to be deleted
         */
        function deleteLineItem(lineItem) {
            var id = vm.requisition.requisitionLineItems.indexOf(lineItem);
            if (id > -1) {
                makeProductVisible(vm.requisition.requisitionLineItems[id].orderable.fullProductName);
                vm.requisition.requisitionLineItems.splice(id, 1);
                reload();
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name addProduct
         *
         * @description
         * Opens modal that lets the user add new product to the grid.
         */
        function addProduct() {
            addProductModalService.show(
                vm.requisition.availableNonFullSupplyProducts,
                vm.requisition.program.id
            ).then(function(lineItem) {
                vm.requisition.requisitionLineItems.push(
                    new LineItem(lineItem, vm.requisition)
                );
                reload();
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
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
         * @ngdoc methodOf
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name getTotalItems
         *
         * @description
         * Returns the number of all visible non full supply line items.
         *
         * @return {Number} the total number of visible non full supply line items
         */
        function getTotalItems() {
            return filterRequisitionLineItems().length;
        }

        function makeProductVisible(productName) {
            angular.forEach(vm.requisition.availableNonFullSupplyProducts, function(product) {
                if (product.name === productName) product.$visible = true;
            });
        }

        function filterRequisitionLineItems() {
            var nonFullSupplyLineItems = $filter('filter')(vm.requisition.requisitionLineItems, {
                $program: {
                    fullSupply:false
                }
            });

            return $filter('orderBy')(nonFullSupplyLineItems, [
                '$program.orderableCategoryDisplayOrder',
                '$program.orderableCategoryDisplayName',
                '$program.displayOrder',
                'orderable.fullProductName'
            ]);
        }

        function reload() {
            vm.items = filterRequisitionLineItems();
            $state.reload();
        }
    }

})();
