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

describe('currencyService', function() {

    beforeEach(function() {
        module('openlmis-currency');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.currencyService = $injector.get('currencyService');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.localStorageService = $injector.get('localStorageService');
        });

        this.currencySettings = {
            currencyCode: 'USD',
            currencySymbol: '$',
            currencySymbolSide: 'left',
            currencyDecimalPlaces: 2,
            groupingSeparator: ',',
            groupingSize: 3,
            decimalSeparator: '.'
        };

        this.settingsJson = angular.toJson(this.currencySettings);
    });

    it('should get currency settings from storage', function() {
        spyOn(this.localStorageService, 'get').andReturn(this.settingsJson);

        expect(this.currencyService.getFromStorage()).toEqual(this.currencySettings);
    });

    it('should get currency settings and save it to storage', function() {
        this.$httpBackend
            .when('GET', this.openlmisUrlFactory('/api/currencySettings'))
            .respond(200, this.currencySettings);
        spyOn(this.localStorageService, 'add');

        this.currencyService.getCurrencySettings();

        this.$httpBackend.flush();

        expect(this.localStorageService.add)
            .toHaveBeenCalledWith('currencySettings', this.settingsJson);
    });

    it('should get currency settings from config and save it to storage', function() {
        spyOn(this.localStorageService, 'add');

        this.currencyService.getCurrencySettingsFromConfig();

        expect(this.localStorageService.add).toHaveBeenCalled();
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });

});
