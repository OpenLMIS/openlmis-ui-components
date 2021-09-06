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

describe('localeService', function() {

    beforeEach(function() {
        module('openlmis-locale');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.localeService = $injector.get('localeService');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.localStorageService = $injector.get('localStorageService');
        });

        this.localeSettings = {
            currencyCode: 'PLN',
            currencySymbol: 'zł',
            currencySymbolSide: 'right',
            currencyDecimalPlaces: 2,
            groupingSeparator: ' ',
            groupingSize: 3,
            decimalSeparator: ',',
            timeZoneId: 'Europe/Warsaw',
            dateFormat: 'dd/MM/yyyy',
            dateTimeFormat: 'dd/MM/yyyy HH:mm:ss'
        };

        //these must be the same as config.json
        this.defaultLocaleSettings = {
            currencyCode: 'USD',
            currencySymbol: '$',
            currencySymbolSide: 'left',
            currencyDecimalPlaces: 2,
            groupingSeparator: ',',
            groupingSize: 3,
            decimalSeparator: '.',
            timeZoneId: 'UTC',
            dateFormat: 'dd/MM/yyyy',
            dateTimeFormat: 'dd/MM/yyyy HH:mm:ss'
        };

        this.settingsJson = angular.toJson(this.localeSettings);
        this.defaultSettingsJson = angular.toJson(this.defaultLocaleSettings);
    });

    it('should get locale settings from storage', function() {
        spyOn(this.localStorageService, 'get').and.returnValue(this.settingsJson);

        expect(this.localeService.getFromStorage()).toEqual(this.localeSettings);
    });

    it('should set locale settings from config if none in storage and get settings', function() {
        spyOn(this.localStorageService, 'get').and.returnValue(undefined);
        spyOn(this.localStorageService, 'add');

        this.localeService.getFromStorage();

        expect(this.localStorageService.add).toHaveBeenCalled();
    });

    it('should get locale settings and save it to storage', function() {
        this.$httpBackend
            .when('GET', this.openlmisUrlFactory('/localeSettings'))
            .respond(200, this.localeSettings);
        spyOn(this.localStorageService, 'add');

        this.localeService.getLocaleSettings();

        this.$httpBackend.flush();

        expect(this.localStorageService.add)
            .toHaveBeenCalledWith('localeSettings', this.settingsJson);
    });

    it('should fail in getting locale settings and save default values to storage', function() {
        this.$httpBackend
            .when('GET', this.openlmisUrlFactory('/localeSettings'))
            .respond(404);
        spyOn(this.localStorageService, 'add');

        this.localeService.getLocaleSettings();

        this.$httpBackend.flush();

        expect(this.localStorageService.add)
            .toHaveBeenCalledWith('localeSettings', this.defaultSettingsJson);
    });

    it('should get locale settings from config and save it to storage', function() {
        spyOn(this.localStorageService, 'add');

        this.localeService.getLocaleSettingsFromConfig();

        expect(this.localStorageService.add).toHaveBeenCalled();
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });

});
