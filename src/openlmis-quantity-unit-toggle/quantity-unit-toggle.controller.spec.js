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

describe('QuantityUnitToggleController', function() {

    var vm, $controller, $rootScope, messageService, QUANTITY_UNIT, quantityUnitConfigService;

    beforeEach(function() {
        module('openlmis-quantity-unit-toggle', function($provide) {
            $provide.value('featureFlagService', {
                set: function() {},
                get: function() {}
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            messageService = $injector.get('messageService');
            QUANTITY_UNIT = $injector.get('QUANTITY_UNIT');
            quantityUnitConfigService = $injector.get('quantityUnitConfigService');
        });

        vm = $controller('QuantityUnitToggleController', {
            messageService: messageService,
            quantityUnitConfigService: quantityUnitConfigService,
            $rootScope: $rootScope
        });
    });

    describe('onInit', function() {

        it('should expose quantityUnits', function() {
            vm.$onInit();

            expect(vm.quantityUnits).toEqual([
                QUANTITY_UNIT.PACKS,
                QUANTITY_UNIT.DOSES
            ]);
        });

        it('should set quantityUnit from the effective unit resolved by the config service', function() {
            spyOn(quantityUnitConfigService, 'getEffectiveUnit').andReturn(QUANTITY_UNIT.PACKS);

            vm.$onInit();

            expect(vm.quantityUnit).toEqual(QUANTITY_UNIT.PACKS);
        });
    });

    describe('isQuantityUnitToggleVisible', function() {

        it('should be visible when mode is BOTH', function() {
            spyOn(quantityUnitConfigService, 'getMode').andReturn(QUANTITY_UNIT.BOTH);

            expect(vm.isQuantityUnitToggleVisible()).toBe(true);
        });

        it('should be hidden when mode is PACKS', function() {
            spyOn(quantityUnitConfigService, 'getMode').andReturn(QUANTITY_UNIT.PACKS);

            expect(vm.isQuantityUnitToggleVisible()).toBe(false);
        });

        it('should be hidden when mode is DOSES', function() {
            spyOn(quantityUnitConfigService, 'getMode').andReturn(QUANTITY_UNIT.DOSES);

            expect(vm.isQuantityUnitToggleVisible()).toBe(false);
        });
    });

    describe('getMessage', function() {

        beforeEach(function() {
            spyOn(messageService, 'get').andReturn('message');
        });

        it('should get localized message for packs', function() {
            expect(vm.getMessage(QUANTITY_UNIT.PACKS)).toEqual('message');

            expect(messageService.get).toHaveBeenCalledWith('openlmisQuantityUnitToggle.packs');
        });

        it('should get localized message for doses', function() {
            expect(vm.getMessage(QUANTITY_UNIT.DOSES)).toEqual('message');

            expect(messageService.get).toHaveBeenCalledWith('openlmisQuantityUnitToggle.doses');
        });
    });

    describe('onChange', function() {

        it('should persist the selected unit through the config service', function() {
            spyOn(quantityUnitConfigService, 'setSelectedUnit');
            vm.quantityUnit = QUANTITY_UNIT.DOSES;

            vm.onChange();

            expect(quantityUnitConfigService.setSelectedUnit).toHaveBeenCalledWith(QUANTITY_UNIT.DOSES);
        });

        it('should emit an event so the selection can be persisted per user', function() {
            spyOn(quantityUnitConfigService, 'setSelectedUnit');
            spyOn($rootScope, '$emit');
            vm.quantityUnit = QUANTITY_UNIT.PACKS;

            vm.onChange();

            expect($rootScope.$emit)
                .toHaveBeenCalledWith('openlmis.quantityUnit.selected', QUANTITY_UNIT.PACKS);
        });
    });

});
