/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */


describe('ResetPasswordController', function() {

    var $rootScope, loginService, $q, alertService, vm, alertSpy, token;

    beforeEach(function() {
        token = '1234';

        module('openlmis-reset-password');

        module(function($provide) {
            var stateParamsSpy = jasmine.createSpyObj('$stateParams', ['token']);
            stateParamsSpy.token = token;
            $provide.factory('$stateParams', function() {
                return stateParamsSpy;
            });

            alertSpy = jasmine.createSpyObj('alertService', ['success']);
            $provide.factory('alertService', function() {
                return alertSpy;
            });

            loginServiceSpy = jasmine.createSpyObj('loginService', ['changePassword']);
            $provide.factory('loginService', function() {
                return loginServiceSpy;
            });
        });

        inject(function (_$rootScope_, $controller, _$q_, _loginService_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            loginService = _loginService_;

            vm = $controller('ResetPasswordController', {});
        });
    });

    describe('changePassword', function() {
        it('should call change password from login service', function() {
            var password = 'password123',
                passwordPassed = false,
                alertSpyMethod = jasmine.createSpy();

            vm.password = password;
            vm.reenteredPassword = password;

            loginService.changePassword.andCallFake(function(pass, tk) {
                if(password === pass && tk === token) passwordPassed = true;
                return $q.when(true);
            });
            alertSpy.success.andCallFake(alertSpyMethod);

            vm.changePassword();
            $rootScope.$apply();

            expect(passwordPassed).toBe(true);
            expect(alertSpyMethod).toHaveBeenCalled();
        });

        it('should set error message after rejecting change password call', function() {
            var password = 'password123',
                deferred = $q.defer();

            vm.password = password;
            vm.reenteredPassword = password;

            loginService.changePassword.andCallFake(function() {
                return deferred.promise;
            });

            vm.changePassword();

            deferred.reject();
            $rootScope.$apply();

            expect(vm.error).toEqual('msg.change.password.failed');
        });

        it('should set error message if password are different', function() {
            vm.password = 'password1';
            vm.reenteredPassword = 'password2';

            vm.changePassword();

            expect(vm.error).toEqual('error.password.mismatch');
        });

        it('should set error message if password is too short', function() {
            var password = 'pass1';

            vm.password = password;
            vm.reenteredPassword = password;

            vm.changePassword();

            expect(vm.error).toEqual('error.password.short');
        });

        it('should set error message if password is too short', function() {
            var password = 'passwordWithoutNumber';

            vm.password = password;
            vm.reenteredPassword = password;

            vm.changePassword();

            expect(vm.error).toEqual('error.password.number');
        });
    });

});
