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
     * @name openlmis-quantity-unit-input.controller:QuantityUnitInputController
     *
     * @description
     * Responsible for managing input element for packs and doses.
     */
    angular
        .module('openlmis-quantity-unit-input')
        .controller('QuantityUnitInputController', controller);

    controller.$inject = ['quantityUnitCalculateService'];

    function controller(quantityUnitCalculateService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.isQuantityRemainderInDosesDisabled = isQuantityRemainderInDosesDisabled;
        vm.changeValue = changeValue;

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-input.controller:QuantityUnitInputController
         * @name onInit
         *
         * @description
         * Initiate method for QuantityUnitInputController.
         */
        function onInit() {
            if (vm.item && vm.isQuantityRemainderInDosesDisabled()) {
                vm.item.quantityRemainderInDoses = 0;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-input.controller:QuantityUnitInputController
         * @name changeValue
         *
         * @description
         * Recalculate input quantity.
         */
        function changeValue(item) {
            item = quantityUnitCalculateService.recalculateInputQuantity(
                item, vm.netContent, vm.showInDoses
            );

            vm.onChangeQuantity({
                lineItem: item
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-input.controller:QuantityUnitInputController
         * @name isQuantityRemainderInDosesDisabled
         *
         * @description
         * Check if quantityRemainderInDoses input is disabled.
         */
        function isQuantityRemainderInDosesDisabled() {
            return vm.netContent === 1;
        }

    }
})();
