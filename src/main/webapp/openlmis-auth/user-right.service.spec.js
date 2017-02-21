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

describe('userRightService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactoryMock, userRightService;

    beforeEach(function() {
        module('openlmis-auth', function($provide) {
            referencedataUrlFactoryMock = jasmine.createSpy();

            $provide.factory('referencedataUrlFactory', function() {
                return referencedataUrlFactoryMock;
            });

            referencedataUrlFactoryMock.andCallFake(function(parameter) {
                return parameter;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _userRightService_) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            userRightService = _userRightService_;
        });
    });

    describe('hasRight', function() {
        it('should call hasRight endpoint with all params', function() {
            var data,
                hasRight = 'true',
                userId = '1',
                rightId = '2',
                programId = '3',
                facilityId = '4',
                warehouseId = '5';

            $httpBackend.when('GET', referencedataUrlFactoryMock('/api/users/' + userId +
                '/hasRight?facilityId=' + facilityId +
                '&programId=' + programId +
                '&rightId=' + rightId +
                '&warehouseId=' + warehouseId)).respond(200, hasRight);

            userRightService.hasRight(userId, rightId, programId, facilityId, warehouseId).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).not.toBe(undefined);
        });

        it('should call hasRight endpoint with all params', function() {
            var data,
                hasRight = 'true',
                userId = '1',
                rightId = '2';

            $httpBackend.when('GET', referencedataUrlFactoryMock('/api/users/' + userId +
                '/hasRight?rightId=' + rightId)).respond(200, hasRight);

            userRightService.hasRight(userId, rightId).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).not.toBe(undefined);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
