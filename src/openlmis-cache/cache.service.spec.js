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

        inject(function (_$rootScope_, _cacheService_, _$q_) {
            cacheService = _cacheService_;
            $q = _$q_;
            $rootScope = _$rootScope_;
        });

        testKey = "test";
    });

    it('should keep promise in array until resolve', function () {
        var deffered = $q.defer();

        cacheService.cache(testKey, deffered.promise)

        expect(cacheService.get(testKey)).toEqual(deffered.promise);
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

    it('should print error to console when no data nor promises', function(){
        spyOn(console, 'error');

        cacheService.get(testKey)

        expect(console.error).toHaveBeenCalledWith('No value for key ' + testKey + ' stored');
    })

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