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

describe('programService', function() {

    var $rootScope, $httpBackend, $q, openlmisUrlFactory, offlineService, programsStorage, program1, program2;

    beforeEach(function() {
        module('referencedata-program', function($provide){
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

        inject(function(_$httpBackend_, _$rootScope_, _$q_, _openlmisUrlFactory_, _programService_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            openlmisUrlFactory = _openlmisUrlFactory_;
            programService = _programService_;
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

    it('should get program by id', function() {
        var data;

        $httpBackend.when('GET', openlmisUrlFactory('/api/programs/' + program1.id))
        .respond(200, program1);

        programService.get(program1.id).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data.id).toEqual(program1.id);
        expect(data.name).toEqual(program1.name);
    });

    it('should get all programs', function() {
        var data,
            programWithTemplate = angular.copy(program2);

        $httpBackend.when('GET', openlmisUrlFactory('/api/programs'))
        .respond(200, [program1, program2]);

        programService.getAll().then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data[0].id).toEqual(program1.id);
        expect(data[1].id).toEqual(program2.id);
    });

    it('should get user programs from storage while offline', function() {
        var data,
            userId = '1',
            isForHomeFacility = '2';

        programsStorage.search.andReturn([program1]);

        offlineService.isOffline.andReturn(true);

        programService.getUserPrograms(userId, isForHomeFacility).then(function(response) {
            data = response;
        });

        $rootScope.$apply();

        expect(data[0].id).toBe(program1.id);
    });

    it('should get user programs and save them to storage', function() {
        var data,
            userId = '1',
            isForHomeFacility = '2';

        $httpBackend.when('GET', openlmisUrlFactory('api/users/' + userId + '/programs?forHomeFacility=' + isForHomeFacility)).respond(200, [program1, program2]);

        offlineService.isOffline.andReturn(false);

        programService.getUserPrograms(userId, isForHomeFacility).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data[0].id).toBe(program1.id);
        expect(data[1].id).toBe(program2.id);
        expect(programsStorage.put.callCount).toEqual(2);
    });

});
