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

describe('quantityUnitCalculateService', function() {

    var quantityUnitCalculateService;

    beforeEach(function() {
        module('openlmis-quantity-unit-toggle', function($provide) {
            $provide.value('featureFlagService', {
                set: function() {},
                get: function() {}
            });
        });

        inject(function($injector) {
            quantityUnitCalculateService = $injector.get('quantityUnitCalculateService');
        });
    });

    // These cases mirror the backend fulfillment OrderableDtoTest (and the canonical
    // referencedata Orderable#packsToOrder) one-for-one, so the UI preview matches what the
    // backend will store on send.
    describe('packsToOrder', function() {

        it('should return packs for an exact multiple', function() {
            expect(quantityUnitCalculateService.packsToOrder(20, 10, 0, false)).toEqual(2);
        });

        it('should round up when remainder exceeds threshold', function() {
            expect(quantityUnitCalculateService.packsToOrder(23, 10, 0, false)).toEqual(3);
        });

        it('should not round up when remainder is within threshold', function() {
            expect(quantityUnitCalculateService.packsToOrder(23, 10, 5, false)).toEqual(2);
        });

        it('should round to one when result is zero and roundToZero is false', function() {
            expect(quantityUnitCalculateService.packsToOrder(3, 10, 5, false)).toEqual(1);
        });

        it('should round to zero when result is zero and roundToZero is true', function() {
            expect(quantityUnitCalculateService.packsToOrder(3, 10, 5, true)).toEqual(0);
        });

        it('should return zero for zero net content', function() {
            expect(quantityUnitCalculateService.packsToOrder(10, 0, 0, false)).toEqual(0);
        });

        it('should return zero for non-positive quantity', function() {
            expect(quantityUnitCalculateService.packsToOrder(0, 10, 0, false)).toEqual(0);
            expect(quantityUnitCalculateService.packsToOrder(-5, 10, 0, false)).toEqual(0);
        });
    });
});
