/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

describe('currencyService', function() {

    var $rootScope, $httpBackend, offlineService, currencyService, referencedataUrlFactory,
        localStorageService, currencySettings = {};

    beforeEach(function () {
        module('openlmis-currency');

        inject(function (_$rootScope_, _$httpBackend_, _$q_, _currencyService_, _offlineService_,
                         _referencedataUrlFactory_, _localStorageService_) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            currencyService = _currencyService_;
            offlineService = _offlineService_;
            referencedataUrlFactory = _referencedataUrlFactory_;
            localStorageService = _localStorageService_;
        });

        currencySettings['currencyCode'] = 'USD';
        currencySettings['currencySymbol'] = '$';
        currencySettings['currencySymbolSide'] = 'left';
    });

    describe('get', function () {

        it('should get currency settings from storage when offline', function () {
            var data;

            spyOn(localStorageService, 'get').andReturn(currencySettings);
            spyOn(offlineService, 'isOffline').andReturn(true);

            currencyService.get().then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data).toEqual(currencySettings);
        });

        it('should get currency settings from storage when settings in storage', function () {
            var data;

            spyOn(localStorageService, 'get').andReturn(currencySettings);
            spyOn(offlineService, 'isOffline').andReturn(false);

            currencyService.get().then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data).toEqual(currencySettings);
        });

        it('should get currency settings and save it to storage when settings not in storage', function () {
            var data;

            $httpBackend
                .when('GET', referencedataUrlFactory('/api/currencySettings'))
                .respond(200, currencySettings);
            spyOn(localStorageService, 'get').andReturn(null);
            spyOn(localStorageService, 'add');
            spyOn(offlineService, 'isOffline').andReturn(false);

            currencyService.get().then(function(response) {
                data = response;
            });

            $httpBackend.flush();

            expect(data).toEqual(currencySettings);
            expect(localStorageService.add)
                .toHaveBeenCalledWith('currencySettings',
                        '{"currencyCode":"USD","currencySymbol":"$","currencySymbolSide":"left"}');
        });
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
