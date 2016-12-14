/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('FacilityService', function() {

    var $rootScope, $httpBackend, $q, FacilityService, Offline, facilitiesStorage, facility1, facility2;

    beforeEach(function() {
        module('openlmis.requisitions');

        module(function($provide){
            facilitiesStorage = jasmine.createSpyObj('facilitiesStorage', ['get', 'getAll', 'put']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function(argumentObject) {
                return facilitiesStorage;
            });

            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _OpenlmisURL_, _$q_, _Offline_, _localStorageFactory_, _FacilityService_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            OpenlmisUrl = _OpenlmisURL_;
            Offline = _Offline_;
            FacilityService = _FacilityService_;
        });

        facility1 = {
            id: '1',
            name: 'facility1'
        };
        facility2 = {
            id: '2',
            name: 'facility2'
        };
    });

    describe('get factory', function() {

        it('should get facility by id from storage while offline', function() {
            var data;

            facilitiesStorage.get.andReturn(facility2);
            Offline.isOffline = true;

            FacilityService.get(facility2.id).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data.id).toBe(facility2.id);
        });

        it('should get facility by id and save it to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', OpenlmisUrl('/api/facilities/' + facility1.id)).respond(200, facility1);
            facilitiesStorage.put.andCallFake(spy);
            Offline.isOffline = false;

            FacilityService.get(facility1.id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.id).toBe(facility1.id);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('get all factories', function() {

        it('should get all facilities from storage while offline', function() {
            var data;

            facilitiesStorage.getAll.andReturn([facility1, facility2]);
            Offline.isOffline = true;

            FacilityService.getAll().then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data[0].id).toBe(facility1.id);
            expect(data[1].id).toBe(facility2.id);
        });

        it('should get all facilities and save them to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', OpenlmisUrl('/api/facilities')).respond(200, [facility1, facility2]);
            facilitiesStorage.put.andCallFake(spy);
            Offline.isOffline = false;

            FacilityService.getAll().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facility1.id);
            expect(data[1].id).toBe(facility2.id);
            expect(spy.callCount).toEqual(2);
        });
    });
});
