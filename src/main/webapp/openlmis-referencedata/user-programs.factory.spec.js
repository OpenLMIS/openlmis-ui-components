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

    var $rootScope, $httpBackend, $q, OpenlmisUrl, offlineService, programsStorage, program1, program2;

    beforeEach(function() {
        module('openlmis-referencedata', function($provide){
            programsStorage = jasmine.createSpyObj('programsStorage', ['getBy', 'getAll', 'put', 'search']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return programsStorage;
            });
            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });

            offlineService = jasmine.createSpyObj('offlineService', ['isOffline']);
            $provide.service('offlineService', function() {
                return offlineService;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _openlmisUrlFactory_, _$q_, _userProgramsFactory_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            OpenlmisUrl = _openlmisUrlFactory_;
            userProgramsFactory = _userProgramsFactory_;
        });

        program1 = {
            id: '1',
            name: 'program1'
        };
        program2 = {
            id: '2',
            name: 'program2'
        };
    });

    it('should get user programs from storage while offline', function() {
        var data,
            userId = '1',
            isForHomeFacility = '2';

        programsStorage.search.andReturn([program1]);

        offlineService.isOffline.andReturn(true);

        userProgramsFactory.get(userId, isForHomeFacility).then(function(response) {
            data = response;
        });

        $rootScope.$apply();

        expect(data[0].id).toBe(program1.id);
    });

    it('should get user programs and save them to storage', function() {
        var data,
            userId = '1',
            isForHomeFacility = '2';

        $httpBackend.when('GET', OpenlmisUrl('api/users/' + userId + '/programs?forHomeFacility=' + isForHomeFacility)).respond(200, [program1, program2]);

        offlineService.isOffline.andReturn(false);

        userProgramsFactory.get(userId, isForHomeFacility).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data[0].id).toBe(program1.id);
        expect(data[1].id).toBe(program2.id);
        expect(programsStorage.put.callCount).toEqual(2);
    });

});
