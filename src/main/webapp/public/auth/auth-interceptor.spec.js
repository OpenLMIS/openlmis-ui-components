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

  var AuthorizationService, $rootScope, $state, InterceptorService;

  function setupTest(){
    module('openlmis-auth');

    module(function($stateProvider){
      $stateProvider.state('somewhere', {
        url: '/somewhere'
      })
      .state('home', {});
    });

    inject(function(_AuthorizationService_, _$rootScope_, _$state_, _InterceptorService_) {
      AuthorizationService = _AuthorizationService_;
      $rootScope = _$rootScope_;
      $state = _$state_;
      InterceptorService = _InterceptorService_;

      spyOn($state, 'go').andCallThrough();
      spyOn(InterceptorService, 'onLoginRequired');
    });
  }

  it('will redirect user to login if auth token is not set and state is home', function(){
    setupTest();
    spyOn(AuthorizationService, 'isAuthenticated').andReturn(false);

    $state.go('home');
    $rootScope.$apply();

    expect($state.go).toHaveBeenCalledWith('auth.login');
  });

  it('will call InterceptorService.onLoginRequired if auth token is not set and state is not home', function(){
    setupTest();
    spyOn(AuthorizationService, 'isAuthenticated').andReturn(false);

    $state.go('somewhere');
    $rootScope.$apply();

    expect(InterceptorService.onLoginRequired).toHaveBeenCalled();
  });

  it('will not redirect user if accessing pages in "auth.*" routes, and user is NOT authenticated', function(){
    setupTest();
    spyOn(AuthorizationService, 'isAuthenticated').andReturn(false);

    $state.go('auth.login');
    $rootScope.$apply();

    // User not redirected, because only $state.go call is original.
    expect($state.go.calls.length).toEqual(1);

  });

  it('will not redirect user if auth token is set, unless page is login.html', function(){
    setupTest();
    spyOn(AuthorizationService, 'isAuthenticated').andReturn(true);

    // Call 1
    $state.go('somewhere');
    $rootScope.$apply();

    expect($state.go.calls.length).toEqual(1);

    // Call 2
    $state.go('auth.login');
    $rootScope.$apply();

    expect($state.go).toHaveBeenCalledWith('home');

    // Call 1 + 2, and redirect to 'home'
    expect($state.go.calls.length).toEqual(3);

  });

  it('should call InterceptorService.onLoginRequired  on event:auth-loginRequired'), function(){
    $rootScope.$broadcast('event:auth-loginRequired');

    expect(InterceptorService.onLoginRequired).toHaveBeenCalled();
  }

});
