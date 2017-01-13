/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('facilityService', function() {

    var $rootScope, $httpBackend, openlmisUrlFactory, facilityService, offlineService, facilitiesStorage, facility1, facility2;

    beforeEach(function() {
        module('openlmis-facility', function($provide){

            facilitiesStorage = jasmine.createSpyObj('facilitiesStorage', ['getBy', 'getAll', 'put', 'search']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return facilitiesStorage;
            });
            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });

            offlineService = jasmine.createSpyObj('offineService', ['isOffline']);
            $provide.service('offlineService', function() {
                return offlineService;
            });

        });

        inject(function(_$httpBackend_, _$rootScope_, _openlmisUrlFactory_, _localStorageFactory_, _facilityService_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            openlmisUrlFactory = _openlmisUrlFactory_;
            facilityService = _facilityService_;
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

    describe('get', function() {

        it('should get facility by id from storage while offline', function() {
            var data;

            facilitiesStorage.getBy.andReturn(facility2);

            offlineService.isOffline.andReturn(true);

            facilityService.get(facility2.id).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data.id).toBe(facility2.id);
        });

        it('should get facility by id and save it to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', openlmisUrlFactory('/api/facilities/' + facility1.id)).respond(200, facility1);
            facilitiesStorage.put.andCallFake(spy);

            offlineService.isOffline.andReturn(false);

            facilityService.get(facility1.id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.id).toBe(facility1.id);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('getAll', function() {

        it('should get all facilities from storage while offline', function() {
            var data;

            facilitiesStorage.getAll.andReturn([facility1, facility2]);

            offlineService.isOffline.andReturn(true);

            facilityService.getAll().then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data[0].id).toBe(facility1.id);
            expect(data[1].id).toBe(facility2.id);
        });

        it('should get all facilities and save them to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', openlmisUrlFactory('/api/facilities')).respond(200, [facility1, facility2]);
            facilitiesStorage.put.andCallFake(spy);

            offlineService.isOffline.andReturn(false);

            facilityService.getAll().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facility1.id);
            expect(data[1].id).toBe(facility2.id);
            expect(spy.callCount).toEqual(2);
        });
    });

    describe('getUserSupervisedFacilities', function() {
        it('should get supervised facilities from storage while offline', function() {
            var data,
                userId = '1',
                programId = '2',
                rightId = '3';

            facilitiesStorage.search.andReturn([facility1]);

            offlineService.isOffline.andReturn(true);

            facilityService.getUserSupervisedFacilities(userId, programId, rightId).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data[0].id).toBe(facility1.id);
        });

        it('should get supervised facilities and save them to storage', function() {
            var data,
                userId = '1',
                programId = '2',
                rightId = '3';

            $httpBackend.when('GET', openlmisUrlFactory('api/users/' + userId + '/supervisedFacilities?programId=' + programId + '&rightId=' + rightId)).respond(200, [facility1, facility2]);

            offlineService.isOffline.andReturn(false);

            facilityService.getUserSupervisedFacilities(userId, programId, rightId).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facility1.id);
            expect(data[1].id).toBe(facility2.id);
            expect(facilitiesStorage.put.callCount).toEqual(2);
        });
    });
});
