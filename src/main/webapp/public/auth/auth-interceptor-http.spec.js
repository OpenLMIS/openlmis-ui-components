/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("AuthInterceptorHttp", function() {

  var AuthorizationService, $rootScope, $http, $httpBackend, OpenlmisURL, messageService, bootbox, $q, LoadingModalService;

  beforeEach(function() {
      module('openlmis-auth')

      var mockDependency = function () {
        var deferred = $q.defer();
        deferred.resolve('<div></div>');
        return deferred.promise;
      }

      module(function ($provide) {
        $provide.value('$templateRequest', mockDependency);
      });
  });

  beforeEach(inject(function(_AuthorizationService_, _$rootScope_, OpenlmisURLService, _OpenlmisURL_, _$http_, _$httpBackend_, $state, _messageService_, _bootbox_, _$q_, _LoadingModalService_) {
      AuthorizationService = _AuthorizationService_;
      $rootScope = _$rootScope_;
      $http = _$http_;
      $httpBackend = _$httpBackend_;
      OpenlmisURL = _OpenlmisURL_;
      messageService = _messageService_;
      bootbox = _bootbox_;
      $q = _$q_;
      LoadingModalService = _LoadingModalService_;

      spyOn($state, 'go');

      OpenlmisURLService.url = 'http://localhost';

      spyOn(bootbox, 'dialog');
      spyOn(LoadingModalService, 'close');
  }));

  it('will add access token if user is authenticated', function(){
    var success = false;

    spyOn(messageService, 'populate');
    $httpBackend.expect('GET', "http://localhost/somewhere").respond(401);

    AuthorizationService.clearAccessToken();
    $http({
      method: "GET",
      url: OpenlmisURL('somewhere')
    });
    $httpBackend.flush();

    expect(success).toBe(false);

    $httpBackend.expect('GET', "http://localhost/somewhere?access_token=sample-token")
      .respond(function(){
        success = true;
        return 200;
      });

    AuthorizationService.setAccessToken("sample-token");
    $http({
      method: "GET",
      url: OpenlmisURL('somewhere')
    });
    $httpBackend.flush();

    expect(success).toBe(true);
  });

  it('will not replace access token, if already added to URL', function(){
    var success = false;
    $httpBackend.expect('GET', "http://localhost/somewhere?access_token=other-token")
      .respond(function(){
        success = true;
        return 200;
      });

    AuthorizationService.setAccessToken("sample-token");
    $http({
      method: "GET",
      url: OpenlmisURL('somewhere?access_token=other-token')
    });
    $httpBackend.flush();

    expect(success).toBe(true);
  });

  it('will correctly be added to http requests that have other URL parameters', function(){
    var success = false;
    $httpBackend.expect('GET', "http://localhost/somewhere?foo=bar&baz=blip&access_token=sample-token")
      .respond(function(){
        success = true;
        return 200;
      });

    AuthorizationService.setAccessToken("sample-token");
    $http({
      method: "GET",
      url: OpenlmisURL('somewhere?foo=bar&baz=blip')
    });
    $httpBackend.flush();

    expect(success).toBe(true);

    success = false;
    $httpBackend.expect('GET', "http://localhost/somewhere?access_token=sample-token&baz=blip&foo=bar")
      .respond(function(){
        success = true;
        return 200;
      });
    AuthorizationService.setAccessToken("sample-token");
    $http({
      method: "GET",
      url: OpenlmisURL('somewhere'),
      params: {
        "foo": "bar",
        "baz": "blip"
      }
    });
    $httpBackend.flush();

    expect(success).toBe(true);
  });

  it('should open login modal dialog on event:auth-loginRequired', function () {
      $rootScope.$broadcast('event:auth-loginRequired');
      $rootScope.$apply();

      expect(bootbox.dialog).toHaveBeenCalled();
  })

  it('should close loading dialog on event:auth-loginRequired', function () {
      $rootScope.$broadcast('event:auth-loginRequired');
      $rootScope.$apply();

      expect(LoadingModalService.close).toHaveBeenCalled();
  })

});
