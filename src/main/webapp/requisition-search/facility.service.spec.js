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

    var $rootScope, $httpBackend, $q, OpenlmisUrl, FacilityService, offlineService, facilitiesStorage, facility1, facility2, supervisedFacilities, authorizationService;

    beforeEach(function() {
        module('requisition-search', function($provide){
            facilitiesStorage = jasmine.createSpyObj('facilitiesStorage', ['getBy', 'getAll', 'put']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return facilitiesStorage;
            });

            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });

            supervisedFacilities = jasmine.createSpyObj('supervisedFacilities', ['get']);

            $provide.factory('supervisedFacilitiesFactory', function() {
                return supervisedFacilities;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _openlmisUrlFactory_, _$q_, _offlineService_, _localStorageFactory_, _facilityService_, _authorizationService_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            OpenlmisUrl = _openlmisUrlFactory_;
            offlineService = _offlineService_;
            facilityService = _facilityService_;
            authorizationService = _authorizationService_;
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

            spyOn(offlineService, 'isOffline').andReturn(true);

            facilityService.get(facility2.id).then(function(response) {
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

            spyOn(offlineService, 'isOffline').andReturn(false);

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

            spyOn(offlineService, 'isOffline').andReturn(true);

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

            $httpBackend.when('GET', OpenlmisUrl('/api/facilities')).respond(200, [facility1, facility2]);
            facilitiesStorage.put.andCallFake(spy);

            spyOn(offlineService, 'isOffline').andReturn(false);

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

    describe('getsupervisedFacilitiesFactory', function() {

        it('should get all facilities and save them to storage', function() {
            var data,
                supervisedPrograms = [
                    {
                        name: 'program1',
                        id: '1'
                    },
                    {
                        name: 'program2',
                        id: '2'
                    }
                ],
                userId = '1';

            spyOn(authorizationService, 'getRightByName').andReturn({id: '1'});
            supervisedFacilities.get.andCallFake(function() {
                return $q.when([facility1]);
            });


            facilityService.getsupervisedFacilitiesFactory(supervisedPrograms, userId).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data[0].id).toBe(facility1.id);
            expect(supervisedFacilities.get.callCount).toEqual(2);
        });
    });
});
