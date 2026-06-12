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
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

describe('QuantityUnitInputController', function() {

    var vm, $controller, quantityUnitCalculateService;

    beforeEach(function() {
        module('openlmis-quantity-unit-input');

        quantityUnitCalculateService = jasmine.createSpyObj('quantityUnitCalculateService', [
            'recalculateInputQuantity'
        ]);

        inject(function($injector) {
            $controller = $injector.get('$controller');
        });

        vm = $controller('QuantityUnitInputController', {
            quantityUnitCalculateService: quantityUnitCalculateService
        });
    });

    describe('isQuantityRemainderInDosesDisabled', function() {

        it('should return true when netContent is equal to 1', function() {
            vm.netContent = 1;

            expect(vm.isQuantityRemainderInDosesDisabled()).toBe(true);
        });

        it('should return false when netContent is greater than 1', function() {
            vm.netContent = 10;

            expect(vm.isQuantityRemainderInDosesDisabled()).toBe(false);
        });
    });

    describe('onInit', function() {

        it('should reset quantityRemainderInDoses to 0 when disabled', function() {
            vm.netContent = 1;
            vm.item = {
                quantityRemainderInDoses: 5
            };

            vm.$onInit();

            expect(vm.item.quantityRemainderInDoses).toBe(0);
        });

        it('should not change quantityRemainderInDoses when not disabled', function() {
            vm.netContent = 10;
            vm.item = {
                quantityRemainderInDoses: 5
            };

            vm.$onInit();

            expect(vm.item.quantityRemainderInDoses).toBe(5);
        });

        it('should not fail when item is not set', function() {
            vm.netContent = 1;
            vm.item = undefined;

            expect(function() {
                vm.$onInit();
            }).not.toThrow();
        });
    });

    describe('changeValue', function() {

        it('should recalculate input quantity and emit the change', function() {
            var item = {
                quantityInPacks: 2
            };
            var recalculated = {
                quantityInPacks: 2,
                quantity: 20
            };
            vm.netContent = 10;
            vm.showInDoses = false;
            vm.onChangeQuantity = jasmine.createSpy('onChangeQuantity');
            quantityUnitCalculateService.recalculateInputQuantity.andReturn(recalculated);

            vm.changeValue(item);

            expect(quantityUnitCalculateService.recalculateInputQuantity)
                .toHaveBeenCalledWith(item, 10, false);
            expect(vm.onChangeQuantity).toHaveBeenCalledWith({
                lineItem: recalculated
            });
        });
    });

});
