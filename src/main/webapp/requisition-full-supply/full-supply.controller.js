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
     * @name requisition-full-supply.FullSupplyController
     *
     * @description
     * Responsible for managing product grid for full supply products.
     */
    angular
        .module('requisition-full-supply')
        .controller('FullSupplyController', controller);

    controller.$inject = [
        '$controller', 'requisitionValidator', 'TEMPLATE_COLUMNS', 'requisition', 'columns',
        'items', 'stateParams', 'totalItems'
    ];

    function controller($controller, requisitionValidator, TEMPLATE_COLUMNS, requisition, columns,
                        items, stateParams, totalItems) {

        var vm = this;

        $controller('BasePaginationController', {
            vm: vm,
            items: items,
            totalItems: totalItems,
            stateParams: stateParams,
            externalPagination: false,
            itemValidator: requisitionValidator.isLineItemValid
        });

        vm.stateParams.rnr = requisition.id;

        vm.areSkipControlsVisible = areSkipControlsVisible;
        vm.skipAll = skipAll;
        vm.unskipAll = unskipAll;
        vm.isSkipColumn = isSkipColumn;

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
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = columns;

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
         * @name areSkipControlsVisible
         *
         * @description
         * Checks if the current requisition template has a skip column, and if the requisition state allows for skipping.
         */
        function areSkipControlsVisible(){
            if(!requisition.$isSubmitted() && !requisition.$isInitiated()){
                return false;
            }

            var hasSkipColumn = false;
            columns.forEach(function(column){
                if(isSkipColumn(column)){
                    hasSkipColumn = true;
                }
            });
            return hasSkipColumn;
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


        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyController
         * @name skippedAll
         * @type {Object}
         *
         * @description
         * Indicated if the skip all button has been clicked.
         *
         */
        vm.skippedAll = false;

        function setSkipAll(value) {
            angular.forEach(items, function(lineItem) {
                if (lineItem.canBeSkipped(vm.requisition)) {
                    lineItem.skipped = value;
                }
            });
            vm.skippedAll = value;
        }
    }

})();
