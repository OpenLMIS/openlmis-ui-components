/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("loginService", function() {

    var $rootScope, httpBackend, loginService, authorizationService, Right, $state;

    beforeEach(function() {
        module('openlmis-login');

        module(function($provide){
            $provide.factory('authUrl', function(pathFactory){
                return function(url){
                    return pathFactory('', url);
                };
            });
            $provide.factory('openlmisUrlFactory', function(pathFactory){
               return function(url){
                   return pathFactory('', url);
               };
            });

            // Turn off AuthToken
            $provide.factory('accessTokenProvider', function(){
                return {};
            });

            Right = jasmine.createSpyObj('Right', ['buildRights']);
            $provide.factory('Right', function() {
                return Right;
            });
        });

        module(function($stateProvider){
            $stateProvider.state('home', {});
            $stateProvider.state('somewhere', {});
        });

        inject(function(_$httpBackend_, _$rootScope_, _loginService_, _authorizationService_, _$state_){
            httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            loginService = _loginService_;
            authorizationService = _authorizationService_;
            $state = _$state_;

            httpBackend.when('GET', 'credentials/auth_server_client.json')
            .respond(200, {
                'auth.server.clientId': 'client',
                'auth.server.clientSecret': 'secret'
            });

            httpBackend.when('POST', '/api/oauth/token?grant_type=password')
            .respond(function(method, url, data){
                if(data.indexOf('bad-password') >= 0 ){
                    return [400];
                } else {
                    return [200,{
                        "access_token": "4b06a35c-9684-4f8c-b9d0-ce2c6cd685de",
                        "token_type": "bearer",
                        "expires_in": 1733,
                        "scope": "read write",
                        "referenceDataUserId": "35316636-6264-6331-2d34-3933322d3462"
                    }];
                }
            });

            httpBackend.when('GET', '/api/users/35316636-6264-6331-2d34-3933322d3462')
            .respond(200, {
                "referenceDataUserId": "35316636-6264-6331-2d34-3933322d3462",
                "username": "admin",
                "password": "$2a$10$4IZfidcJzbR5Krvj87ZJdOZvuQoD/kvPAJe549rUNoP3N3uH0Lq2G",
                "email": "test@openlmis.org",
                "role": "ADMIN"
            });

            httpBackend.when('GET', '/api/users/35316636-6264-6331-2d34-3933322d3462/roleAssignments')
            .respond(200, {});

            spyOn($rootScope, '$emit');
        });
    });

    describe('login', function() {
        it('should reject bad logins', function() {
            var error = false;
            loginService.login("john", "bad-password")
            .catch(function(){
                error = true;
            });

            httpBackend.flush();
            $rootScope.$apply();

            expect(error).toBe(true);
        });

        it('should resolve successful logins', function() {
            var success = false;

            loginService.login("john", "john-password")
            .then(function(){
                success = true;
            });

            httpBackend.flush();
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('login will get user data', function(){
            loginService.login("john", "john-password");
            httpBackend.flush();
            $rootScope.$apply();

            var user = authorizationService.getUser();

            expect(user.user_id).toBe("35316636-6264-6331-2d34-3933322d3462");
        });
    });

    it('will clear user data on logout', function(){
        spyOn(authorizationService, "clearAccessToken");
        spyOn(authorizationService, "clearUser");
        spyOn(authorizationService, "clearRights");

        // Login a user
        loginService.login("john", "john-password");
        httpBackend.flush();
        $rootScope.$apply();

        httpBackend.when('POST', '/api/users/logout')
        .respond(200);

        loginService.logout();

        httpBackend.flush();
        $rootScope.$apply();

        // User credentials are removed.
        expect(authorizationService.clearAccessToken).toHaveBeenCalled();
        expect(authorizationService.clearUser).toHaveBeenCalled();
        expect(authorizationService.clearRights).toHaveBeenCalled();

    });

    it('should emit "auth.login" event when logging in through auth page', function(){
        spyOn($state, 'is').andReturn('auth.login');
        authorizationService.clearAccessToken();

        loginService.login("john", "john-password");
        httpBackend.flush();
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('auth.login');
    });

    it('should emit "auth.login-modal" event when logging in through page other than auth', inject(function($rootScope){
        authorizationService.clearAccessToken();

        $state.go('somewhere');
        $rootScope.$apply();

        loginService.login("john", "john-password");
        httpBackend.flush();
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('auth.login-modal');
    }));

    it('should call forgot password endpoint', inject(function() {
        var email = 'user@openlmis.org',
            spy = jasmine.createSpy();

        httpBackend.when('POST', '/api/users/forgotPassword?email=' + email)
        .respond(200, {});

        loginService.forgotPassword(email).then(spy);

        httpBackend.flush();
        $rootScope.$apply();

        expect(spy).toHaveBeenCalled();
    }));

    it('should call change password endpoint', inject(function() {
        var data = {
                token: '1234',
                newPassword: 'secret1234'
            },
            spy = jasmine.createSpy();

        httpBackend.when('POST', '/api/users/changePassword')
        .respond(function(method, url, body){
            if(body === angular.toJson(data)){
                return [200];
            } else {
                return [404];
            }
        });

        loginService.changePassword(data.newPassword, data.token).then(spy);

        httpBackend.flush();
        $rootScope.$apply();

        expect(spy).toHaveBeenCalled();
    }));
});
