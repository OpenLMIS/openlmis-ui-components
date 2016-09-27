/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("NavigationController", function() {

  var scope, ctrl, $httpBackend, $location, window, rights, access_token;
  var access_token = '4b06a35c-9684-4f8c-b9d0-ce2c6cd685de';

  //TODO: Change this when the ability to retrieve user's rights is added.
  var rights = [{
      "name": "DELETE_REQUISITION",
      "type": "REQUISITION"
    }, {
      "name": "MANAGE_DISTRIBUTION",
      "type": "ALLOCATION"
    }, {
      "name": "CREATE_REQUISITION",
      "type": "REQUISITION"
    }, {
      "name": "VIEW_ORDER",
      "type": "FULFILLMENT"
    }, {
      "name": "MANAGE_EQUIPMENT_INVENTORY",
      "type": "REQUISITION"
    }, {
      "name": "MANAGE_STOCK",
      "type": "REQUISITION"
    }, {
      "name": "AUTHORIZE_REQUISITION",
      "type": "REQUISITION"
    }, {
      "name": "VIEW_REQUISITION",
      "type": "REQUISITION"
    }, {
      "name": "APPROVE_REQUISITION",
      "type": "REQUISITION"
    }, {
      "name": "FACILITY_FILL_SHIPMENT",
      "type": "FULFILLMENT"
    }, {
      "name": "MANAGE_POD",
      "type": "FULFILLMENT"
    }, {
      "name": "VIEW_STOCK_ON_HAND",
      "type": "REQUISITION"
    }, {
      "name": "MANAGE_SUPERVISED_EQUIPMENTS",
      "type": "REQUISITION"
    }, {
      "name": "CONVERT_TO_ORDER",
      "type": "FULFILLMENT"
    }];

  beforeEach(module('openlmis'));

  beforeEach(inject(function($rootScope, $controller, _localStorageService_, _$httpBackend_, _$location_) {
    $httpBackend = _$httpBackend_;
    $location = _$location_;
    window = {};
    scope = $rootScope.$new();
    localStorageService = _localStorageService_;

    spyOn(localStorageService, 'get').andCallFake(function(key){
      if(key == 'RIGHTS'){
        return JSON.stringify(rights);
      } else {
        return access_token;
      }
    });

    ctrl = $controller(NavigationController, {
      $scope: scope,
      localStorageService: localStorageService,
      $window: window
    });
    
  }));

  it('should check permission', function() {
    expect(false).toEqual(scope.hasPermission("MANAGE_FACILITY"));
    expect(true).toEqual(scope.hasPermission("CREATE_REQUISITION"));
  });

  it('should check reporting permission', function() {
    expect(scope.hasReportingPermission()).toBeFalsy();
  });

  it('should set user rights into scope', function() {
    expect(scope.rights).toEqual(JSON.stringify(rights));
  });

  describe("go online", function() {
    it("should take user to root if currently on offline home page and network is connected", function() {
      $httpBackend.expectGET('/requisition/api/settings/LOGIN_SUCCESS_DEFAULT_LANDING_PAGE.json?access_token=' + access_token)
        .respond(200, {
          settings: {
            value: '/public/pages/dashboard/index.html'
          }
        });
      $httpBackend.expectGET("/locales.json").respond(200, {
        locales: ['en', 'pt']
      });
      spyOn($location, 'absUrl').andReturn("/public/pages/offline.html");
      spyOn($location, 'path');

      scope.goOnline();

      $httpBackend.flush();
      expect(window.location).toEqual("/");
      expect(scope.showNetworkError).toBeFalsy();
    });

    it("should take user to online version of app if network is connected", function() {
      $httpBackend.expectGET('/requisition/api/settings/LOGIN_SUCCESS_DEFAULT_LANDING_PAGE.json?access_token=' + access_token)
        .respond(200, {
          settings: {
            value: '/public/pages/dashboard/index.html'
          }
        });
      $httpBackend.expectGET("/locales.json").respond(200, {
        locales: ['en', 'pt']
      });
      spyOn($location, 'absUrl').andReturn("/page/offline.html#/list");
      spyOn($location, 'path');

      scope.goOnline();

      $httpBackend.flush();
      expect(window.location).toEqual("/page/index.html#/manage");
      expect(scope.showNetworkError).toBeFalsy();
    });

    it("should set offline flag and not change URI if network is disconnected", function() {
      $httpBackend.expectGET('/requisition/api/settings/LOGIN_SUCCESS_DEFAULT_LANDING_PAGE.json?access_token=' + access_token)
        .respond(200, {
          settings: {
            value: '/public/pages/dashboard/index.html'
          }
        });
      $httpBackend.expectGET("/locales.json").respond(200, {
        locales: undefined
      });
      window = {
        location: "/pages/test"
      };

      scope.goOnline();

      $httpBackend.flush();
      expect(window.location).toEqual("/pages/test");
      expect(scope.showNetworkError).toBeTruthy();
    });
  });
});