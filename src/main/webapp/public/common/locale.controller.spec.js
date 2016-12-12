/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe("LocaleController", function () {


  beforeEach(module('openlmis-core'));

  var controller, scope, $cookies;

  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller, messageService, localStorageService, $cookies) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    var messagesReturned = {"messages": {"key": "message"}};
    $httpBackend.expect('GET', 'messages/messages_en.json').respond(messagesReturned);
    $httpBackend.expect('GET', 'messages/messages_pt.json').respond(messagesReturned);

    controller = $controller('LocaleController', {
      $scope: scope,
      $rootScope: $rootScope,
      messageService: messageService,
      localStorageService: localStorageService,
      $cookies: $cookies
    });
  }));

  it("Should change the locale and clear local storage", function () {
    // scope.changeLocale('pt');
    // $httpBackend.flush();
  });

});
