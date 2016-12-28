/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('ResetPasswordController', function() {

    var $rootScope, LoginService, $q, $state, Alert, vm, alertSpyMethod, token;

    beforeEach(function() {
        alertSpyMethod = jasmine.createSpy();
        token = '1234';

        module('openlmis-auth');

        module(function($provide) {
            var stateParamsSpy, alertSpy;

            alertSpy = jasmine.createSpy('Alert').andCallFake(alertSpyMethod);
            $provide.factory('Alert', function() {
                return alertSpy;
            });

            LoginServiceSpy = jasmine.createSpyObj('LoginService', ['changePassword']);
            $provide.factory('LoginService', function() {
                return LoginServiceSpy;
            });

            stateParamsSpy = jasmine.createSpyObj('$stateParams', ['token']);
            stateParamsSpy.token = token;
            $provide.factory('$stateParams', function() {
                return stateParamsSpy;
            });
        });

        inject(function (_$rootScope_, $controller, _$q_, _$state_, _LoginService_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            $state = _$state_;
            LoginService = _LoginService_;

            vm = $controller('ResetPasswordController', {});
        });
    });

    describe('changePassword', function() {
        it('should call change password from login service', function() {
            var password = 'pass123',
                stateGoSpy = jasmine.createSpy(),
                passwordPassed = false;

            vm.password1 = password;
            vm.password2 = password;

            LoginService.changePassword.andCallFake(function(pass, tk) {
                if(password === pass && tk === token) passwordPassed = true;
                return $q.when(true);
            });
            spyOn($state, 'go').andCallFake(stateGoSpy);

            vm.changePassword();
            $rootScope.$apply();

            expect(passwordPassed).toBe(true);
            expect(stateGoSpy).toHaveBeenCalledWith('auth.login.form');
            expect(alertSpyMethod).toHaveBeenCalledWith('password.reset.success');
        });

        it('should set error message after rejecting change password call', function() {
            var password = 'pass123',
                deferred = $q.defer();

            vm.password1 = password;
            vm.password2 = password;

            LoginService.changePassword.andCallFake(function() {
                return deferred.promise;
            });

            vm.changePassword();

            deferred.reject();
            $rootScope.$apply();

            expect(vm.error).toEqual('msg.change.password.failed');
        });

        it('should set error message if password are different', function() {
            vm.password1 = 'pass1';
            vm.password2 = 'pass2';

            vm.changePassword();

            expect(vm.error).toEqual('error.password.mismatch');
        });
    });

});
