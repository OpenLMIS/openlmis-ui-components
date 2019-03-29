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

    var $httpBackend, localeService, openlmisUrlFactory, localStorageService, localeSettings, settingsJson,
        defaultLocaleSettings, defaultSettingsJson;

    beforeEach(function() {
        module('openlmis-locale');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            localeService = $injector.get('localeService');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            localStorageService = $injector.get('localStorageService');
        });

        localeSettings = {
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
        defaultLocaleSettings = {
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

        settingsJson = angular.toJson(localeSettings);
        defaultSettingsJson = angular.toJson(defaultLocaleSettings);
    });

    it('should get locale settings from storage', function() {
        spyOn(localStorageService, 'get').andReturn(settingsJson);

        expect(localeService.getFromStorage()).toEqual(localeSettings);
    });

    it('should set locale settings from config if none in storage and get settings', function() {
        spyOn(localStorageService, 'get').andReturn(undefined);
        spyOn(localStorageService, 'add');

        localeService.getFromStorage();

        expect(localStorageService.add).toHaveBeenCalled();
    });

    it('should get locale settings and save it to storage', function() {
        $httpBackend
            .when('GET', openlmisUrlFactory('/localeSettings'))
            .respond(200, localeSettings);
        spyOn(localStorageService, 'add');

        localeService.getLocaleSettings();

        $httpBackend.flush();

        expect(localStorageService.add)
            .toHaveBeenCalledWith('localeSettings', settingsJson);
    });

    it('should fail in getting locale settings and save default values to storage', function() {
        $httpBackend
            .when('GET', openlmisUrlFactory('/localeSettings'))
            .respond(404);
        spyOn(localStorageService, 'add');

        localeService.getLocaleSettings();

        $httpBackend.flush();

        expect(localStorageService.add)
            .toHaveBeenCalledWith('localeSettings', defaultSettingsJson);
    });

    it('should get locale settings from config and save it to storage', function() {
        spyOn(localStorageService, 'add');

        localeService.getLocaleSettingsFromConfig();

        expect(localStorageService.add).toHaveBeenCalled();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
