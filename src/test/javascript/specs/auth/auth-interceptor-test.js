/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("AuthInterceptor", function() {

  var AuthService, $window, localStorageService, $rootScope;

  function setupTest(){
    module('openlmis');

    $window = {location: { 
            href: '/public/pages/index.html',
            assign: jasmine.createSpy()
        }};

    module(function($provide){
        $provide.value('$window', $window);
    });

    inject(function(_AuthService_, _localStorageService_, _$rootScope_) {
        AuthService = _AuthService_;
        localStorageService = _localStorageService_;
        $rootScope = _$rootScope_;

        localStorageService.clearAll();
      });
  }

  it('will redirect user if auth token is not set, unless page is login.html', function(){
    setupTest();

    $rootScope.$broadcast('$routeChangeStart');

    expect($window.location.assign).toHaveBeenCalledWith('/public/pages/login.html');
    expect($window.location.assign.calls.length).toEqual(1);

    $window.location.href = '/public/pages/login.html';
    $rootScope.$broadcast('$routeChangeStart');

    // assign never called
    expect($window.location.assign.calls.length).toEqual(1);

  });

  it('will not redirect user if auth token is set, unless page is login.html', function(){
    setupTest();
    localStorageService.add(localStorageKeys.ACCESS_TOKEN, "ACCESS_TOKEN");
    
    $rootScope.$broadcast('$routeChangeStart');

    expect($window.location.assign.calls.length).toEqual(0);

    $window.location.href ='/public/pages/login.html';
    $rootScope.$broadcast('$routeChangeStart');

    expect($window.location.assign).toHaveBeenCalledWith('/public/pages/index.html');
    expect($window.location.assign.calls.length).toEqual(1);

  });

});
