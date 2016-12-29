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

    var AuthorizationService, $rootScope, $state;

    function setupTest(){
        module('openlmis-auth');

        module(function($stateProvider){
            $stateProvider.state('somewhere', {
                url: '/somewhere',
                accessRights: ['VIEW']
            })
            .state('home', {});
        });

        inject(function(_AuthorizationService_, _$rootScope_, _$state_, _Alert_) {
            AuthorizationService = _AuthorizationService_;
            Alert = _Alert_;
            $rootScope = _$rootScope_;
            $state = _$state_;

            spyOn($state, 'go').andCallThrough();
            spyOn($rootScope, '$emit');
        });
    }

    beforeEach(function(){
        setupTest();
    });

    it('will redirect user to login if auth token is not set and state is home', function(){
        spyOn(AuthorizationService, 'isAuthenticated').andReturn(false);

        $state.go('home');
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('auth.login');
    });

    it('will call event event:auth-loginRequired if auth token is not set and state is not home', function(){
        spyOn(AuthorizationService, 'isAuthenticated').andReturn(false);

        $state.go('somewhere');
        $rootScope.$apply();

        expect($rootScope.$emit).toHaveBeenCalledWith('event:auth-loginRequired', true);
    });

    it('will not call event event:auth-loginRequired if auth token is not set and state is not home and fromState is auth.login', function(){
        spyOn(AuthorizationService, 'isAuthenticated').andReturn(false);

        $state.go('auth.login');
        $rootScope.$apply();

        $state.go('somewhere');
        $rootScope.$apply();

        expect($rootScope.$emit).not.toHaveBeenCalled();
    });

      it('should close loading dialog if auth token is not set and state is not home', inject(function (LoadingModalService) {
        spyOn(AuthorizationService, 'isAuthenticated').andReturn(false);
        spyOn(LoadingModalService, 'close');

        $state.go('somewhere');
        $rootScope.$apply();

        expect(LoadingModalService.close).toHaveBeenCalled();
      }));


    it('will not redirect user if accessing pages in "auth.*" routes, and user is NOT authenticated', function(){
        spyOn(AuthorizationService, 'isAuthenticated').andReturn(false);

        $state.go('auth.login');
        $rootScope.$apply();

        // User not redirected, because only $state.go call is original.
        expect($state.go.calls.length).toEqual(1);

    });

    it('will not redirect user if auth token is set, unless page is login.html', function(){
        spyOn(AuthorizationService, 'isAuthenticated').andReturn(true);
        spyOn(AuthorizationService, 'hasRights').andReturn(true);

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

    it('should reload page on event:auth-loggedIn', function() {
        spyOn(AuthorizationService, 'isAuthenticated').andReturn(false);

        $state.go('somewhere');
        $rootScope.$apply();

        $rootScope.$broadcast('event:auth-loggedIn');
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith({ url : '/somewhere', accessRights : [ 'VIEW' ], name : 'somewhere' }, {});
    });

    it('should go to home page on auth.login event', function() {
        spyOn(AuthorizationService, 'isAuthenticated').andReturn(true);
        spyOn(AuthorizationService, 'hasRights').andReturn(true);

        $state.go('somewhere');
        $rootScope.$apply();

        $rootScope.$broadcast('auth.login');
        $rootScope.$apply();

        expect($state.is('home')).toBe(true);
    });

    it('should call alert if has no permission to enter state', function() {
        var spy = jasmine.createSpy();

        spyOn(AuthorizationService, 'isAuthenticated').andReturn(true);
        spyOn(AuthorizationService, 'hasRights').andReturn(false);
        spyOn(Alert, 'error').andCallFake(spy);

        $state.go('somewhere');
        $rootScope.$apply();

        expect(spy).toHaveBeenCalled();
    });
});
