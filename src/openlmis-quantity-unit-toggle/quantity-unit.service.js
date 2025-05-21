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
   * @name openlmis-quantity-unit-toggle.quantityUnitCalculateService
   *
   * @description
   * Responsible for calculations on olmis related quantities
   */
    angular
        .module('openlmis-quantity-unit-toggle')
        .service('quantityUnitCalculateService', service);

    service.$inject = ['messageService'];

    function service(messageService) {

        this.recalculateSOHQuantity = recalculateSOHQuantity;
        this.recalculateInputQuantity = recalculateInputQuantity;

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-toggle.quantityUnitCalculateService
         * @name recalculateSOHQuantity
         *
         * @description
         * Recalculates the given stock on hand quantity to packs or to doses
         *
         * @param  {Object}  stockOnHand   the quantity to be recalculated
         * @param  {number}  netContent    quantity of doses in one pack
         * @param  {boolean} inDoses       unit to recalculated
         * 
         * @return {String}                quantity in the appropriate unit (packs or doses)
         */
        function recalculateSOHQuantity(stockOnHand, netContent, inDoses) {
            if (inDoses) {
                return stockOnHand;
            }

            if (isNetContentUndefinedOrZero(netContent)) {
                return 0;
            }

            var packs = (stockOnHand > 0) ? Math.floor(stockOnHand / netContent) : Math.ceil(stockOnHand / netContent);
            var remainderDoses = stockOnHand % netContent;

            if (remainderDoses === 0) {
                return packs;
            }

            if (remainderDoses > 0) {
                return packs + ' ( +' + remainderDoses + messageService.get('openlmisInputDosesPacks.DosesBracket');
            }
            return packs + ' ( ' + remainderDoses + messageService.get('openlmisInputDosesPacks.DosesBracket');
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-toggle.quantityUnitCalculateService
         * @name recalculateInputQuantity
         *
         * @description
         * Recalculates the given input quantity to packs or to doses
         *
         * @param  {Object}  item          the quantity in packs to be recalculated
         * @param  {number}  netContent    quantity of doses in one pack
         * @param  {boolean} inDoses       current unit of input item
         * 
         * @return {item}                  number of doses
         */
        function recalculateInputQuantity(item, netContent, inDoses) {
            if (isNetContentUndefinedOrZero(netContent)) {
                return 0;
            } else if (inDoses) {
                item.quantityInPacks = Math.floor(item.quantity / netContent);
                item.quantityRemainderInDoses = item.quantity % netContent;
            } else {
                item.quantity = getTotalQuantityInDoses(
                    item.quantityInPacks, item.quantityRemainderInDoses, netContent
                );
            }
            return item;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-toggle.quantityUnitCalculateService
         * @name getTotalQuantityInDoses
         *
         * @description
         * Recalculates the given quantity in packs and remainder in doses to doses
         *
         * @param  {number}  quantityInPacks          the quantity in packs to be recalculated
         * @param  {number}  quantityRemainderInDoses the remainder quantity in doses to be recalculated
         * @param  {number}  netContent               quantity of doses in one pack
         * 
         * @return {number}                           number of doses
         */
        function getTotalQuantityInDoses(quantityInPacks, quantityRemainderInDoses, netContent) {
            var quantityInDoses = 0;
            if (quantityInPacks !== undefined) {
                quantityInDoses = quantityInPacks * netContent;
            }
            quantityInDoses += quantityRemainderInDoses;
            return quantityInDoses;
        }

        function isNetContentUndefinedOrZero(netContent) {
            if (netContent === undefined || netContent === 0) {
                return true;
            }
            return false;
        }

    }
})();
