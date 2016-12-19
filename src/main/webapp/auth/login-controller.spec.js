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

  beforeEach(module('openlmis-auth'));

  beforeEach(module(function($provide){
    // Turn off AuthToken
    $provide.factory('HttpAuthAccessToken', function(){
      return {};
    });
  }));

  var $rootScope, scope, LoginController, messageService, controller;

  beforeEach(inject(function(_$rootScope_, $controller, _messageService_) {
    controller = $controller;
    $rootScope = _$rootScope_;

    scope = $rootScope.$new();

    spyOn(scope, '$emit');

    scope.loginConfig = {
      "preventReload":true
    };

    messageService = _messageService_;
    spyOn(messageService, 'get');

    LoginController = controller("LoginController", {
      $scope: scope,
      messageService: messageService
    });

  }));

  beforeEach(inject(function($q, LoginService){
    spyOn(LoginService, 'login').andCallFake(function(username, password){
      if(password == "bad-password"){
        return $q.reject();
      } else {
        return $q.when();
      }
    });
  }));

  it('should not login and show error when server returns error', function() {
    scope.username = "john";
    scope.password = "bad-password";

    spyOn(messageService, 'populate');
    spyOn(location, 'reload');

    scope.doLogin();
    $rootScope.$apply();

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
  });

  it('should show error when password is missing', function() {
    scope.username = "someUser";
    scope.password = undefined;
    scope.doLogin();
    expect(messageService.get).toHaveBeenCalledWith('error.login.password');
  });

  it('should clear password on failed login attempt', function() {
    scope.username = "john";
    scope.password = "bad-password";

    spyOn(messageService, 'populate');

    scope.doLogin();
    $rootScope.$apply();

    expect(scope.password).toBe(undefined);
  });

  it('should clear password on successful login attempt', function() {
    scope.username = "john";
    scope.password = "john-password";

    scope.doLogin();
    $rootScope.$apply();

    expect(scope.password).toBe(undefined);
  });
});
