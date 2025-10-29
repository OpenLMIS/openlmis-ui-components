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
     * @ngdoc service
     * @name openlmis-quantity-unit-input.component:QuantityUnitInput
     *
     * @description
     * Component responsible for displaying the appropriate input depending on the Packs or Doses option selected.
     * Component have 5 attributes:
     * showInDoses - returns whether the screen is showing quantities in doses
     * item - model for the inputs. Holds quantity information in doses and packs
     * netContent - number of doses per pack for a given object
     * inputClass - holds information about css classes
     * onChangeQuantity - method that will be executed on input change with item value as parameter.
     * 
     * 
     * @example
     * <openlmis-quantity-unit-input 
     *       show-in-doses="vm.showInDoses()" 
     *       item="lineItem" 
     *       on-change-quantity="vm.validateQuantity(lineItem)"
     *       input-class="{'error': lineItem.$errors.quantityInvalid}"/>
     */
    angular
        .module('openlmis-quantity-unit-input')
        .component('openlmisQuantityUnitInput', {
            controller: 'QuantityUnitInputController',
            controllerAs: 'vm',
            templateUrl: 'openlmis-quantity-unit-input/openlmis-quantity-unit-input.html',
            bindings: {
                showInDoses: '<',
                item: '=',
                netContent: '<',
                inputClass: '<',
                onChangeQuantity: '&',
                disabled: '<?'
            }
        });
})();
