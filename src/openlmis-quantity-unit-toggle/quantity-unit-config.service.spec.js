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

describe('quantityUnitConfigService', function() {

    beforeEach(function() {
        module('openlmis-quantity-unit-toggle', function($provide) {
            $provide.value('featureFlagService', {
                set: function() {},
                get: function() {}
            });
        });

        inject(function($injector) {
            this.quantityUnitConfigService = $injector.get('quantityUnitConfigService');
            this.QUANTITY_UNIT = $injector.get('QUANTITY_UNIT');
            this.localStorageService = $injector.get('localStorageService');
        });
    });

    describe('getMode', function() {

        it('should default to BOTH when no facility mode is set', function() {
            expect(this.quantityUnitConfigService.getMode()).toEqual(this.QUANTITY_UNIT.BOTH);
        });

        it('should return mode set via setMode', function() {
            this.quantityUnitConfigService.setMode(this.QUANTITY_UNIT.PACKS);

            expect(this.quantityUnitConfigService.getMode()).toEqual(this.QUANTITY_UNIT.PACKS);
        });

        it('should ignore an invalid mode and keep the previous one', function() {
            this.quantityUnitConfigService.setMode('NONSENSE');

            expect(this.quantityUnitConfigService.getMode()).toEqual(this.QUANTITY_UNIT.BOTH);
        });

        it('should ignore an undefined mode and keep the previous one', function() {
            this.quantityUnitConfigService.setMode(this.QUANTITY_UNIT.DOSES);
            this.quantityUnitConfigService.setMode(undefined);

            expect(this.quantityUnitConfigService.getMode()).toEqual(this.QUANTITY_UNIT.DOSES);
        });
    });

    describe('resetMode', function() {

        it('should reset the mode back to the build-time default', function() {
            this.quantityUnitConfigService.setMode(this.QUANTITY_UNIT.PACKS);

            this.quantityUnitConfigService.resetMode();

            expect(this.quantityUnitConfigService.getMode()).toEqual(this.QUANTITY_UNIT.BOTH);
        });
    });

    describe('getEffectiveUnit', function() {

        it('should force PACKS and ignore storage when mode is PACKS', function() {
            spyOn(this.localStorageService, 'get').andReturn(this.QUANTITY_UNIT.DOSES);
            this.quantityUnitConfigService.setMode(this.QUANTITY_UNIT.PACKS);

            expect(this.quantityUnitConfigService.getEffectiveUnit()).toEqual(this.QUANTITY_UNIT.PACKS);
            expect(this.localStorageService.get).not.toHaveBeenCalled();
        });

        it('should force DOSES and ignore storage when mode is DOSES', function() {
            spyOn(this.localStorageService, 'get').andReturn(this.QUANTITY_UNIT.PACKS);
            this.quantityUnitConfigService.setMode(this.QUANTITY_UNIT.DOSES);

            expect(this.quantityUnitConfigService.getEffectiveUnit()).toEqual(this.QUANTITY_UNIT.DOSES);
            expect(this.localStorageService.get).not.toHaveBeenCalled();
        });

        it('should use the stored unit when mode is BOTH', function() {
            spyOn(this.localStorageService, 'get').andReturn(this.QUANTITY_UNIT.PACKS);
            this.quantityUnitConfigService.setMode(this.QUANTITY_UNIT.BOTH);

            expect(this.quantityUnitConfigService.getEffectiveUnit()).toEqual(this.QUANTITY_UNIT.PACKS);
            expect(this.localStorageService.get).toHaveBeenCalledWith('quantityUnit');
        });

        it('should fall back to the default unit when mode is BOTH and storage is empty', function() {
            spyOn(this.localStorageService, 'get').andReturn(null);
            this.quantityUnitConfigService.setMode(this.QUANTITY_UNIT.BOTH);

            expect(this.quantityUnitConfigService.getEffectiveUnit()).toEqual(this.QUANTITY_UNIT.DOSES);
        });
    });

    describe('setSelectedUnit', function() {

        it('should store the chosen unit under the quantityUnit key', function() {
            spyOn(this.localStorageService, 'add');

            this.quantityUnitConfigService.setSelectedUnit(this.QUANTITY_UNIT.PACKS);

            expect(this.localStorageService.add).toHaveBeenCalledWith('quantityUnit', this.QUANTITY_UNIT.PACKS);
        });

        it('should ignore an invalid unit and not store it', function() {
            spyOn(this.localStorageService, 'add');

            this.quantityUnitConfigService.setSelectedUnit('NONSENSE');

            expect(this.localStorageService.add).not.toHaveBeenCalled();
        });
    });
});
