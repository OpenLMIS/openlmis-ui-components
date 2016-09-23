/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("LoginController", function() {

  beforeEach(module('openlmis'));

  var scope, ctrl, httpBackend, messageService, controller;

  beforeEach(inject(function($rootScope, $controller, _messageService_, _$httpBackend_) {
    httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    messageService = _messageService_;
    spyOn(messageService, 'get');
    controller = $controller;

    ctrl = controller(LoginController, {
      $scope: scope,
      messageService: messageService
    });

    httpBackend.when('GET', '/public/credentials/auth_server_client.json').respond(200, {
      "clientId": "trusted-client",
      "clientSecret": "secret"
    });

  }));

  it('should not login and show error when server returns error', function() {
    scope.username = "john";
    scope.password = "openLmis";

    ctrl = controller(LoginController, {
      $scope: scope,
      messageService: messageService
    });

    spyOn(messageService, 'populate');
    spyOn(location, 'reload');
    httpBackend.when('POST', '/auth/oauth/token?grant_type=password').respond(401);

    scope.doLogin();
    httpBackend.flush();

    expect(scope.loginError).toBe(messageService.get("user.login.error"));
  });

  it('should show error when username is missing', function() {
    scope.username = undefined;
    scope.doLogin();
    expect(messageService.get).toHaveBeenCalledWith('error.login.username');
  });

  it('should show error when username is only whitespaces', function() {
    scope.username = "   ";
    scope.doLogin();
    expect(messageService.get).toHaveBeenCalledWith('error.login.username');
  })

  it('should show error when password is missing', function() {
    scope.username = "someUser";
    scope.password = undefined;
    scope.doLogin();
    expect(messageService.get).toHaveBeenCalledWith('error.login.password');
  });

  it('should clear password on failed login attempt', function() {
    scope.username = "john";
    scope.password = "john-password";

    spyOn(messageService, 'populate');
    httpBackend.when('POST', '/auth/oauth/token?grant_type=password').respond(401);

    scope.doLogin();
    httpBackend.flush();

    expect(scope.password).toBe(undefined);
  });

  it('should clear password on successful login attempt', function() {
    scope.username = "john";
    scope.password = "john-password";
    scope.loginConfig = {
      modalShown: false,
      preventReload: true
    };

    spyOn(messageService, 'populate');
    httpBackend.when('POST', '/auth/oauth/token?grant_type=password').respond(200, {
      "access_token": "4b06a35c-9684-4f8c-b9d0-ce2c6cd685de",
      "token_type": "bearer",
      "expires_in": 1733,
      "scope": "read write",
      "referenceDataUserId": "35316636-6264-6331-2d34-3933322d3462"
    });

    httpBackend.when('GET',
        '/auth/api/users/search/findOneByReferenceDataUserId?referenceDataUserId=35316636-6264-6331-2d34-3933322d3462&access_token=4b06a35c-9684-4f8c-b9d0-ce2c6cd685de')
      .respond(200, {
        "referenceDataUserId": "35316636-6264-6331-2d34-3933322d3462",
        "username": "admin",
        "password": "$2a$10$4IZfidcJzbR5Krvj87ZJdOZvuQoD/kvPAJe549rUNoP3N3uH0Lq2G",
        "email": "test@openlmis.org",
        "role": "ADMIN"
      });

    scope.doLogin();
    httpBackend.flush();

    expect(scope.password).toBe(undefined);
  });
});