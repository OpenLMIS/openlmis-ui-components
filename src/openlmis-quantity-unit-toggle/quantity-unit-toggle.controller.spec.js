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

    var vm, $controller, messageService, QUANTITY_UNIT, localStorageService;

    beforeEach(function() {
        module('openlmis-quantity-unit-toggle');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            messageService = $injector.get('messageService');
            QUANTITY_UNIT = $injector.get('QUANTITY_UNIT');
            localStorageService = $injector.get('localStorageService');
        });

        vm = $controller('QuantityUnitToggleController', {
            messageService: messageService,
            localStorageService: localStorageService
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

        it('should expose default quantityUnit when not cached in storage', function() {
            spyOn(localStorageService, 'get').andReturn(null);

            vm.$onInit();

            expect(vm.quantityUnit).toEqual(QUANTITY_UNIT.DOSES);
            expect(localStorageService.get).toHaveBeenCalledWith('quantityUnit');
        });

        it('should expose quantityUnit doses from storage', function() {
            spyOn(localStorageService, 'get').andReturn('DOSES');

            vm.$onInit();

            expect(vm.quantityUnit).toEqual(QUANTITY_UNIT.DOSES);
        });

        it('should expose quantityUnit packs from storage', function() {
            spyOn(localStorageService, 'get').andReturn('PACKS');

            vm.$onInit();

            expect(vm.quantityUnit).toEqual(QUANTITY_UNIT.PACKS);
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

        it('should add quantityUnit doses to local storage', function() {
            spyOn(localStorageService, 'add');
            vm.quantityUnit = QUANTITY_UNIT.DOSES;

            vm.onChange();

            expect(localStorageService.add).toHaveBeenCalledWith('quantityUnit', QUANTITY_UNIT.DOSES);
        });

        it('should add quantityUnit packs to local storage', function() {
            spyOn(localStorageService, 'add');
            vm.quantityUnit = QUANTITY_UNIT.PACKS;

            vm.onChange();

            expect(localStorageService.add).toHaveBeenCalledWith('quantityUnit', QUANTITY_UNIT.PACKS);
        });

    });

});
