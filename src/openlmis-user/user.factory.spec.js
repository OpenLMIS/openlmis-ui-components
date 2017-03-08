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

describe('userFactory', function() {

    var $rootScope, $httpBackend, userFactory, openlmisUrlFactory, offlineServiceMock, user, localStorageFactoryMock, offlineUserDetails;

    beforeEach(function() {
        module('openlmis-user', function($provide) {
            $provide.factory('accessTokenInterceptor', function() {
                return {};
            });

            offlineServiceMock = jasmine.createSpyObj('offlineService', ['isOffline', 'checkConnection']);
            offlineServiceMock.checkConnection.andCallFake(function() {
                return $q.when(true);
            });
            $provide.service('offlineService', function() {
                return offlineServiceMock;
            });

            localStorageFactoryMock = jasmine.createSpy();
            offlineUserDetails = jasmine.createSpyObj('offlineUserDetails', ['getBy', 'put']);
            localStorageFactoryMock.andReturn(offlineUserDetails);
            $provide.factory('localStorageFactory', function() {
                return localStorageFactoryMock;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _userFactory_, _openlmisUrlFactory_, _$q_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            userFactory = _userFactory_;
            openlmisUrlFactory = _openlmisUrlFactory_;
            $q = _$q_;
        });

        user = {
            id: '1',
            firstName: 'fname',
            lastName: 'lname',
            email: 'email@olmis.com'
        };
    });

    it('should call offline storage factory', function() {
        expect(localStorageFactoryMock).toHaveBeenCalledWith('offlineUserDetails');
    });

    describe('get', function() {

        var data;

        beforeEach(function() {
            offlineUserDetails.getBy.andReturn('user');
            $httpBackend.when('GET', openlmisUrlFactory('/api/users/' + user.id))
            .respond(200, user);
        });

        it('should get user by id while online', function() {

            offlineServiceMock.isOffline.andReturn(false);

            userFactory.get(user.id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(user));
        });

        it('should get user from local storage while offline', function() {

            offlineServiceMock.isOffline.andReturn(true);

            userFactory.get(user.id).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(offlineUserDetails.getBy).toHaveBeenCalledWith('id', user.id);
            expect(data).toEqual('user');
        });
    });
});
