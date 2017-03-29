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

describe('referencedataUserService', function() {

    var $rootScope, $httpBackend, $q, openlmisUrlFactory, offlineService, programsStorage, user1,
        user2, offlineUserDetails;

    beforeEach(function() {
        module('referencedata-user', function($provide) {
            var localStorageFactoryMock = jasmine.createSpy();
            offlineUserDetails = jasmine.createSpyObj('offlineUserDetails', ['getBy', 'put']);
            localStorageFactoryMock.andReturn(offlineUserDetails);
            $provide.factory('localStorageFactory', function() {
                return localStorageFactoryMock;
            });
        });

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            referencedataUserService = $injector.get('referencedataUserService');
            offlineService = $injector.get('offlineService');
        });

        user1 = {
            id: '1',
            name: 'user1'
        };
        user2 = {
            id: '2',
            name: 'user2'
        };
    });

    describe('get', function() {

        var data;

        beforeEach(function() {
            offlineUserDetails.getBy.andReturn('user');
            spyOn(offlineService, 'isOffline');
            $httpBackend.when('GET', openlmisUrlFactory('/api/users/' + user1.id))
            .respond(200, user1);
        });

        it('should get user by id while online', function() {
            offlineService.isOffline.andReturn(false);

            referencedataUserService.get(user1.id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(user1));
        });

        it('should get user from local storage while offline', function() {

            offlineService.isOffline.andReturn(true);

            referencedataUserService.get(user1.id).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(offlineUserDetails.getBy).toHaveBeenCalledWith('id', user1.id);
            expect(data).toEqual('user');
        });
    });

    it('should get all users', function() {
        var data;

        $httpBackend.when('GET', openlmisUrlFactory('/api/users'))
        .respond(200, [user1, user2]);

        referencedataUserService.getAll().then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data[0].id).toEqual(user1.id);
        expect(data[1].id).toEqual(user2.id);
    });

    it('should search for users', function() {
        var data,
            paginationParams = {
                param1: 'param1'
            },
            queryParams = {
                param2: 'param2'
            };

        $httpBackend.when('POST', openlmisUrlFactory('/api/users/search?param1=' + paginationParams.param1))
        .respond(function(method, url, data) {
            if(!angular.equals(data, angular.toJson(queryParams))){
                return [404];
            } else {
                return [200, angular.toJson(user1)];
            }
        });

        referencedataUserService.search(paginationParams, queryParams).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data.id).toEqual(user1.id);
    });

    describe('createUser', function() {

        var user, userResponse;

        beforeEach(function() {
            user = {
                username: "johndoe1",
                firstName: "John",
                lastName: "Doe",
                email: "johndoe1@gmail.com",
                loginRestricted: false
            };

            userResponse = {
                username: 'johndoe1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe1@gmail.com',
                verified: false,
                active: false,
                loginRestricted: false,
                allowNotify: true,
                roleAssignments: [],
                id: 'c9d89cf5-5b79-4ee8-a750-85bcdb94b9e3'
            };

            $httpBackend.whenPUT(openlmisUrlFactory('/api/users'), user).respond(200, userResponse);
        });

        it('should send request', function() {
            $httpBackend.expectPUT(openlmisUrlFactory('/api/users'), user, {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            });

            referencedataUserService.createUser(user);
            $httpBackend.flush();
            $rootScope.$apply();
        });

        it('should return promise', function() {
            var result = referencedataUserService.createUser(user);
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.then).not.toBeUndefined();
        });

        it('should return promise that resolves to user', function() {
            var result;

            referencedataUserService.createUser(user).then(function(response) {
                result = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result).not.toBeUndefined();
            angular.forEach(result, function(value, key) {
                if (key !== '$promise' && key !== '$resolved') {
                    expect(value).toEqual(userResponse[key]);
                }
            });
            angular.forEach(userResponse, function(value, key) {
                expect(value).toEqual(result[key]);
            });
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
