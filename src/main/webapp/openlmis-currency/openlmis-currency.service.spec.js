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

    var $httpBackend, currencyService, referencedataUrlFactory,
        localStorageService, currencySettings = {},
        settingsJson = '{"currencyCode":"USD","currencySymbol":"$","currencySymbolSide":"left","currencyDecimalPlaces":2,"groupingSeparator":",","groupingSize":3,"decimalSeparator":"."}';


    beforeEach(function () {
        module('openlmis-currency');

        inject(function (_$httpBackend_, _$q_, _currencyService_, _referencedataUrlFactory_, _localStorageService_) {
            $httpBackend = _$httpBackend_;
            currencyService = _currencyService_;
            referencedataUrlFactory = _referencedataUrlFactory_;
            localStorageService = _localStorageService_;
        });

        currencySettings['currencyCode'] = 'USD';
        currencySettings['currencySymbol'] = '$';
        currencySettings['currencySymbolSide'] = 'left';
        currencySettings['currencyDecimalPlaces'] = 2;
        currencySettings['groupingSeparator'] = ',';
        currencySettings['groupingSize'] = 3;
        currencySettings['decimalSeparator'] = '.';
    });

    it('should get currency settings from storage', function () {
        spyOn(localStorageService, 'get').andReturn(settingsJson);
        expect(currencyService.getFromStorage()).toEqual(currencySettings);
    });

    it('should get currency settings and save it to storage', function () {
        $httpBackend
            .when('GET', referencedataUrlFactory('/api/currencySettings'))
            .respond(200, currencySettings);
        spyOn(localStorageService, 'add');

        currencyService.getCurrencySettings();

        $httpBackend.flush();

        expect(localStorageService.add)
            .toHaveBeenCalledWith('currencySettings', settingsJson);
    });

    it('should get currency settings from config and save it to storage', function () {
        spyOn(localStorageService, 'add');

        currencyService.getCurrencySettingsFromConfig();

        expect(localStorageService.add)
            .toHaveBeenCalledWith('currencySettings', settingsJson);
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
