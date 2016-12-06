/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("LoginModalInterceptor", function() {

  var $rootScope, OpenlmisURL, bootbox, $q, LoadingModalService;

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

  beforeEach(inject(function(_$rootScope_, _bootbox_, _$q_, _LoadingModalService_, $window) {
      $rootScope = _$rootScope_;
      bootbox = _bootbox_;
      $q = _$q_;
      LoadingModalService = _LoadingModalService_;

      spyOn(bootbox, 'dialog').andReturn({modal: jasmine.createSpy('modal')});
      spyOn(LoadingModalService, 'close');
  }));

  it('should open login modal dialog on event:auth-loginRequired', function () {
      $rootScope.$broadcast('event:auth-loginRequired');
      $rootScope.$apply();

      expect(bootbox.dialog).toHaveBeenCalled();
  });

  it('should close loading dialog on event:auth-loginRequired', function () {
      $rootScope.$broadcast('event:auth-loginRequired');
      $rootScope.$apply();

      expect(LoadingModalService.close).toHaveBeenCalled();
  });

  it('should emit event:auth-loggedIn on auth.login-modal if no retry request', inject(function ($window) {
      $rootScope.$broadcast('event:auth-loginRequired', true);
      $rootScope.$apply();
      spyOn($rootScope, '$emit');

      $rootScope.$broadcast('auth.login-modal');
      $rootScope.$apply();

      expect($rootScope.$emit).toHaveBeenCalledWith('event:auth-loggedIn');
  }));

  it('should call authService.loginConfirmed on auth.login-modal if retry request', inject(function (authService) {
      $rootScope.$broadcast('event:auth-loginRequired');
      $rootScope.$apply();
      spyOn(authService, 'loginConfirmed');

      $rootScope.$broadcast('auth.login-modal');
      $rootScope.$apply();

      expect(authService.loginConfirmed).toHaveBeenCalled();
  }));

});
