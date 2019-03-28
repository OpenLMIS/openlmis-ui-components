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

    var $httpBackend, localeService, openlmisUrlFactory, localStorageService, localeSettings, settingsJson;

    beforeEach(function() {
        module('openlmis-locale');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            localeService = $injector.get('localeService');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            localStorageService = $injector.get('localStorageService');
        });

        localeSettings = {
            currencyCode: 'USD',
            currencySymbol: '$',
            currencySymbolSide: 'left',
            currencyDecimalPlaces: 2,
            groupingSeparator: ',',
            groupingSize: 3,
            decimalSeparator: '.'
        };

        settingsJson = angular.toJson(localeSettings);
    });

    it('should get locale settings from storage', function() {
        spyOn(localStorageService, 'get').andReturn(settingsJson);

        expect(localeService.getFromStorage()).toEqual(localeSettings);
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
