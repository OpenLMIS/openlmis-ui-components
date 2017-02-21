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

describe('facilityService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactory, facilityService, offlineService,
        facilitiesStorage, facilityOne, facilityTwo;

    beforeEach(function() {
        module('referencedata-facility', function($provide){

            facilitiesStorage = jasmine.createSpyObj('facilitiesStorage', ['getBy', 'getAll', 'put', 'search']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return facilitiesStorage;
            });
            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });

            offlineService = jasmine.createSpyObj('offlineService', ['isOffline']);
            $provide.service('offlineService', function() {
                return offlineService;
            });

        });

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            facilityService = $injector.get('facilityService');
        });

        facilityOne = {
            id: '1',
            name: 'facilityOne'
        };
        facilityTwo = {
            id: '2',
            name: 'facilityTwo'
        };
    });

    describe('get', function() {

        it('should get facility by id from storage while offline', function() {
            var data;

            facilitiesStorage.getBy.andReturn(facilityTwo);

            offlineService.isOffline.andReturn(true);

            facilityService.get(facilityTwo.id).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data.id).toBe(facilityTwo.id);
        });

        it('should get facility by id and save it to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', referencedataUrlFactory('/api/facilities/' + facilityOne.id)).respond(200, facilityOne);
            facilitiesStorage.put.andCallFake(spy);

            offlineService.isOffline.andReturn(false);

            facilityService.get(facilityOne.id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.id).toBe(facilityOne.id);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('getAll', function() {

        it('should get all facilities from storage while offline', function() {
            var data;

            facilitiesStorage.getAll.andReturn([facilityOne, facilityTwo]);

            offlineService.isOffline.andReturn(true);

            facilityService.getAll().then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
            expect(data[1].id).toBe(facilityTwo.id);
        });

        it('should get all facilities and save them to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', referencedataUrlFactory('/api/facilities')).respond(200, [facilityOne, facilityTwo]);
            facilitiesStorage.put.andCallFake(spy);

            offlineService.isOffline.andReturn(false);

            facilityService.getAll().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
            expect(data[1].id).toBe(facilityTwo.id);
            expect(spy.callCount).toEqual(2);
        });
    });

    describe('getUserSupervisedFacilities', function() {
        it('should get supervised facilities from storage while offline', function() {
            var data,
                userId = '1',
                programId = '2',
                rightId = '3';

            facilitiesStorage.search.andReturn([facilityOne]);

            offlineService.isOffline.andReturn(true);

            facilityService.getUserSupervisedFacilities(userId, programId, rightId).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
        });

        it('should get supervised facilities and save them to storage', function() {
            var data,
                userId = '1',
                programId = '2',
                rightId = '3';

            $httpBackend.when('GET', referencedataUrlFactory('api/users/' + userId + '/supervisedFacilities?programId=' + programId + '&rightId=' + rightId)).respond(200, [facilityOne, facilityTwo]);

            offlineService.isOffline.andReturn(false);

            facilityService.getUserSupervisedFacilities(userId, programId, rightId).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
            expect(data[1].id).toBe(facilityTwo.id);
            expect(facilitiesStorage.put.callCount).toEqual(2);
        });
    });

    describe('getFulfillmentFacilities', function() {

        var userId, url;

        beforeEach(function() {
            userId = 'user-id';
            url = referencedataUrlFactory('/api/users/' + userId + '/fulfillmentFacilities');

            $httpBackend.when('GET', url).respond(200, [facilityOne]);
        });

        it('should make correct request', function() {
            $httpBackend.expectGET(url);

            facilityService.getFulfillmentFacilities({
                userId: userId
            });
            $httpBackend.flush();
        });

        it('should resolve to facility list', function() {
            var result;

            facilityService.getFulfillmentFacilities({
                userId: userId
            }).then(function(facilities) {
                result = facilities;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.length).toEqual(1);
            expect(result[0].id).toEqual(facilityOne.id);
            expect(result[0].name).toEqual(facilityOne.name);
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
