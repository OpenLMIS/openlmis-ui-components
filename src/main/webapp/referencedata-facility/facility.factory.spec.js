/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('facilityFactory', function() {

    var $rootScope, $q, facility1, facility2, userPrograms, programService, facilityService, authorizationService, facilityFactory;

    beforeEach(function() {
        module('referencedata-facility', function($provide){
            programService = jasmine.createSpyObj('programService', ['getUserPrograms']);

            $provide.factory('programService', function() {
                return programService;
            });

            facilityService = jasmine.createSpyObj('facilityService', ['getUserSupervisedFacilities']);

            $provide.factory('facilityService', function() {
                return facilityService;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _openlmisUrlFactory_, _$q_, _localStorageFactory_, _facilityFactory_, _authorizationService_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            authorizationService = _authorizationService_;
            facilityFactory = _facilityFactory_;
        });

        facility1 = {
            id: '1',
            name: 'facility1'
        };
        facility2 = {
            id: '2',
            name: 'facility2'
        };

        userPrograms = [
            {
                name: 'program1',
                id: '1'
            },
            {
                name: 'program2',
                id: '2'
            }
        ];
    });

    it('should get all facilities and save them to storage', function() {
        var data,
            userId = '1';

        spyOn(authorizationService, 'getRightByName').andReturn({id: '1'});
        programService.getUserPrograms.andCallFake(function() {
            return $q.when(userPrograms);
        });
        facilityService.getUserSupervisedFacilities.andCallFake(function() {
            return $q.when([facility1, facility2]);
        });

        facilityFactory.getUserFacilities(userId, 'REQUISITION_VIEW').then(function(response) {
            data = response;
        });
        $rootScope.$apply();

        expect(data.length).toBe(2);
        expect(data[0].id).toBe(facility1.id);
        expect(data[1].id).toBe(facility2.id);
        expect(facilityService.getUserSupervisedFacilities.callCount).toEqual(2);
    });
});
