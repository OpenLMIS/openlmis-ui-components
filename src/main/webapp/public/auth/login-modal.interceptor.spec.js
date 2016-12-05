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

  beforeEach(inject(function(_$rootScope_, _bootbox_, _$q_, _LoadingModalService_) {
      $rootScope = _$rootScope_;
      bootbox = _bootbox_;
      $q = _$q_;
      LoadingModalService = _LoadingModalService_;


      spyOn(bootbox, 'dialog');
      spyOn(LoadingModalService, 'close');
  }));

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
