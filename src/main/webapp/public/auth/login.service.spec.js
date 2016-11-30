/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("LoginService", function() {

    var $rootScope, $httpBackend, LoginService, AuthorizationService

    beforeEach(module('openlmis-auth'));

    beforeEach(module(function($provide){
        $provide.factory('AuthURL', function(PathFactory){
            return function(url){
                return PathFactory('', url);
            }
        });
        // Turn off AuthToken
        $provide.factory('HttpAuthAccessToken', function(){
          return {};
        });
    }));

    beforeEach(inject(function(_$httpBackend_, _$rootScope_, _LoginService_, _AuthorizationService_){
        httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        LoginService = _LoginService_;
        AuthorizationService = _AuthorizationService_;

        httpBackend.when('GET', 'credentials/auth_server_client.json')
        .respond(200, {
          'auth.server.clientId': 'client',
          'auth.server.clientSecret': 'secret'
        });

        httpBackend.when('POST', '/oauth/token?grant_type=password')
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

        httpBackend.when('GET',
            '/api/users/search/findOneByReferenceDataUserId?referenceDataUserId=35316636-6264-6331-2d34-3933322d3462')
          .respond(200, {
            "referenceDataUserId": "35316636-6264-6331-2d34-3933322d3462",
            "username": "admin",
            "password": "$2a$10$4IZfidcJzbR5Krvj87ZJdOZvuQoD/kvPAJe549rUNoP3N3uH0Lq2G",
            "email": "test@openlmis.org",
            "role": "ADMIN"
          });
    }));

  it('should reject bad logins', function() {
    var error = false;
    LoginService.login("john", "bad-password")
    .catch(function(){
      error = true;
    });

    httpBackend.flush();
    $rootScope.$apply();

    expect(error).toBe(true);
  });

  it('should resolve successful logins', function() {
    var success = false;

    LoginService.login("john", "john-password")
    .then(function(){
      success = true;
    })

    httpBackend.flush();
    $rootScope.$apply();

    expect(success).toBe(true);
  });

  it('login will get user data', function(){
    LoginService.login("john", "john-password");
    httpBackend.flush();
    $rootScope.$apply();

    var user = AuthorizationService.getUser();

    expect(user.user_id).toBe("35316636-6264-6331-2d34-3933322d3462"); 
  });

  it('will clear user data on logout', function(){
    spyOn(AuthorizationService, "clearAccessToken");
    spyOn(AuthorizationService, "clearUser");
    spyOn(AuthorizationService, "clearRights");

    // Login a user
    LoginService.login("john", "john-password");
    httpBackend.flush();
    $rootScope.$apply();

    httpBackend.when('POST', '/api/users/logout')
    .respond(200);

    LoginService.logout();

    httpBackend.flush();
    $rootScope.$apply();

    // User credentials are removed.
    expect(AuthorizationService.clearAccessToken).toHaveBeenCalled();
    expect(AuthorizationService.clearUser).toHaveBeenCalled();
    expect(AuthorizationService.clearRights).toHaveBeenCalled();

  });

});