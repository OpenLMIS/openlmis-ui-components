/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("AuthorizationService", function() {

  beforeEach(module('openlmis-core'));

  var AuthorizationService, httpBackend, $rootScope, localStorageService;

  beforeEach(module(function($provide){
    $provide.factory('AuthURL', function(PathFactory){
      return function(url){
        return PathFactory('/', url);
      }
    })
  }));

  beforeEach(inject(function(_AuthorizationService_, _$httpBackend_, _$rootScope_, _localStorageService_) {
    httpBackend = _$httpBackend_;
    AuthorizationService = _AuthorizationService_;
    $rootScope = _$rootScope_;
    localStorageService = _localStorageService_;

    localStorageService.clearAll();
    spyOn(localStorageService, 'remove');

    // Keep auth interceptor from running....
    spyOn($rootScope, '$on');

  }));



});
