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

describe('cacheService', function() {

    var cacheService, $q, $rootScope, testKey;

    beforeEach(function () {
        module('openlmis-cache');

        inject(function ($injector) {
            cacheService = $injector.get('cacheService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        testKey = "test";
    });

    it('should keep promise in array until resolve', function () {
        var deffered = $q.defer();

        cacheService.cache(testKey, deffered.promise)

        expect(cacheService.get(testKey).then).not.toBeUndefined();
    });

    it('should parse and cache result of promise', function () {
        var deffered = $q.defer();

        cacheService.cache(testKey, deffered.promise, function (obj) {
            return obj * 2;
        })
        deffered.resolve(2);
        $rootScope.$apply();

        expect(cacheService.get(testKey)).toEqual(4);
    });

    it('should return true if cache is ready', function () {
        var deffered = $q.defer();

        cacheService.cache(testKey, deffered.promise, function (obj) {
            return obj * 2;
        })
        deffered.resolve(2);
        $rootScope.$apply();

        expect(cacheService.isReady(testKey)).toBeTruthy();
    });

    it('should return false if cache is not ready', function () {
        var deffered = $q.defer();

        cacheService.cache(testKey, deffered.promise)

        expect(cacheService.isReady(testKey)).toBeFalsy();
    });

    it('should clear cached data', function () {
        var deffered = $q.defer();

        cacheService.cache(testKey, deffered.promise, function (obj) {
            return obj * 2;
        })
        deffered.resolve(2);
        $rootScope.$apply();
        expect(cacheService.get(testKey)).toEqual(4);

        cacheService.clear(testKey);
        $rootScope.$apply();

        expect(cacheService.get(testKey)).toEqual(undefined);
    });

});
