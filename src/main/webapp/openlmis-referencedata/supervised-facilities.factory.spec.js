/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('supervisedFacilitiesFactory', function() {

    var $rootScope, $httpBackend, $q, OpenlmisUrl, offlineService, facilitiesStorage, facility1, facility2;

    beforeEach(function() {
        module('openlmis-referencedata', function($provide){
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

        inject(function(_$httpBackend_, _$rootScope_, _openlmisUrlFactory_, _$q_, _supervisedFacilitiesFactory_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            OpenlmisUrl = _openlmisUrlFactory_;
            supervisedFacilitiesFactory = _supervisedFacilitiesFactory_;
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

    it('should get supervised facilities from storage while offline', function() {
        var data,
            userId = '1',
            programId = '2',
            rightId = '3';

        facilitiesStorage.search.andReturn([facility1]);

        offlineService.isOffline.andReturn(true);

        supervisedFacilitiesFactory.get(userId, programId, rightId).then(function(response) {
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

        $httpBackend.when('GET', OpenlmisUrl('api/users/' + userId + '/supervisedFacilities?programId=' + programId + '&rightId=' + rightId)).respond(200, [facility1, facility2]);

        offlineService.isOffline.andReturn(false);

        supervisedFacilitiesFactory.get(userId, programId, rightId).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data[0].id).toBe(facility1.id);
        expect(data[1].id).toBe(facility2.id);
        expect(facilitiesStorage.put.callCount).toEqual(2);
    });

});
