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


describe('ForgotPasswordController', function() {

    var $rootScope, loginService, $q, $state, vm, alertSpy;

    beforeEach(function() {
        module('openlmis-forgot-password');

        module(function($provide) {
            alertSpy = jasmine.createSpyObj('alertService', ['success']);
            $provide.factory('alertService', function() {
                return alertSpy;
            });

            loginServiceSpy = jasmine.createSpyObj('loginService', ['forgotPassword']);
            $provide.factory('loginService', function() {
                return loginServiceSpy;
            });
        });

        inject(function (_$rootScope_, $controller, _$q_, _$state_, _loginService_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            $state = _$state_;
            loginService = _loginService_;

            vm = $controller('ForgotPasswordController', {});
        });
    });

    describe('forgotPassword', function() {
        it('should call forgot password from login service', function() {
            var email = 'user@openlmis.org',
                mailPassed = false,
                alertSpyMethod = jasmine.createSpy();

            vm.email = email;

            loginService.forgotPassword.andCallFake(function(mail) {
                if(mail === email) mailPassed = true;
                return $q.when(true);
            });
            alertSpy.success.andCallFake(alertSpyMethod);

            vm.forgotPassword();
            $rootScope.$apply();

            expect(mailPassed).toBe(true);
            expect(alertSpyMethod).toHaveBeenCalled();
        });

        it('should set error message after rejecting forgot password call', function() {
            var email = 'user@openlmis.org',
                deferred = $q.defer();

            vm.email = email;

            loginService.forgotPassword.andCallFake(function() {
                return deferred.promise;
            });

            vm.forgotPassword();

            deferred.reject();
            $rootScope.$apply();

            expect(vm.error).toEqual('msg.forgot.password.failed');
        });

        it('should set error message when email is not valid', function() {
            var email = 'openlmis.org';

            vm.forgotPassword();

            expect(vm.error).toEqual('user.email.invalid');
        });
    });

    it('should redirect to login page', function() {
        var stateGoSpy = jasmine.createSpy();
        spyOn($state, 'go').andCallFake(stateGoSpy);

        vm.redirectToLogin();

        expect(stateGoSpy).toHaveBeenCalledWith('auth.login');
    });

});
