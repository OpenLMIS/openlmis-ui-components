/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("AuthService", function() {

  beforeEach(module('openlmis'));

  var AuthService, httpBackend, $rootScope;

  beforeEach(inject(function(_AuthService_, _$httpBackend_, _$rootScope_, localStorageService) {
    httpBackend = _$httpBackend_;
    AuthService = _AuthService_;
    $rootScope = _$rootScope_;

    localStorageService.clearAll();

    httpBackend.when('GET', '/public/credentials/auth_server_client.json').respond(200, {
      "clientId": "trusted-client",
      "clientSecret": "secret"
    });

    httpBackend.when('POST', '/oauth/token?grant_type=password&username=john&password=bad-password').respond(401);

    httpBackend.when('POST', '/oauth/token?grant_type=password&username=john&password=john-password').respond(200, {
      "access_token": "4b06a35c-9684-4f8c-b9d0-ce2c6cd685de",
      "token_type": "bearer",
      "expires_in": 1733,
      "scope": "read write",
      "referenceDataUserId": "35316636-6264-6331-2d34-3933322d3462"
    });

    httpBackend.when('GET',
        '/api/users/search/findOneByReferenceDataUserId?referenceDataUserId=35316636-6264-6331-2d34-3933322d3462&access_token=4b06a35c-9684-4f8c-b9d0-ce2c6cd685de')
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
    AuthService.login("john", "bad-password")
    .catch(function(){
      error = true;
    });

    httpBackend.flush();
    $rootScope.$apply();

    expect(error).toBe(true);
  });

  it('should resolve successful logins', function() {
    var success = false;

    AuthService.login("john", "john-password")
    .then(function(){
      success = true;
    })

    httpBackend.flush();
    $rootScope.$apply();

    expect(success).toBe(true);
  });

  it('will get user data only when authenticated', function(){
    var getUserInfo = function(){
      var success = false;

      AuthService.getUserInfo()
      .then(function(){
        success = true;
      });

      httpBackend.flush();
      $rootScope.$apply();

      return success;
    }

    var result;

    result = getUserInfo();
    expect(result).toBe(false);

    AuthService.login("john", "john-password");
    httpBackend.flush();
    $rootScope.$apply();
    result = getUserInfo();
    expect(result).toBe(true); 

  });
});