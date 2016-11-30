/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("InterceptorService", function() {

    var InterceptorService, bootbox, $q, $rootScope, LoadingModalService;

    beforeEach(module('openlmis-auth'));

    beforeEach(function () {
      var mockDependency = function () {
          var deferred = $q.defer();
          deferred.resolve('<div></div>');
          return deferred.promise;
      }

      module(function ($provide) {
          $provide.value('$templateRequest', mockDependency);
      });
    });

    beforeEach(inject(function (_InterceptorService_, _bootbox_, _$q_, _$rootScope_, _LoadingModalService_) {
        InterceptorService = _InterceptorService_;
        bootbox = _bootbox_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        LoadingModalService = _LoadingModalService_;

        spyOn(bootbox, 'dialog');
        spyOn(LoadingModalService, 'close');
    }));

    it('should open login modal dialog', function () {
        InterceptorService.onLoginRequired();
        $rootScope.$apply();

        expect(bootbox.dialog).toHaveBeenCalled();
    })

    it('should close loading dialog', function () {
        InterceptorService.onLoginRequired();
        $rootScope.$apply();

        expect(LoadingModalService.close).toHaveBeenCalled();
    })

});