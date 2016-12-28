/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('ForgotPasswordController', function() {

    var $rootScope, LoginService, $q, $state, Alert, vm, alertSpyMethod;

    beforeEach(function() {
        alertSpyMethod = jasmine.createSpy();

        module('openlmis-auth');

        module(function($provide) {
            var alertSpy = jasmine.createSpy('Alert').andCallFake(alertSpyMethod);

            $provide.factory('Alert', function() {
                return alertSpy;
            });

            LoginServiceSpy = jasmine.createSpyObj('LoginService', ['forgotPassword']);

            $provide.factory('LoginService', function() {
                return LoginServiceSpy;
            });


        });

        inject(function (_$rootScope_, $controller, _$q_, _$state_, _LoginService_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            $state = _$state_;
            LoginService = _LoginService_;

            vm = $controller('ForgotPasswordController', {});
        });
    });

    describe('forgotPassword', function() {
        it('should call forgot password from login service', function() {
            var email = 'user@openlmis.org',
                stateGoSpy = jasmine.createSpy(),
                mailPassed = false;

            vm.email = email;

            LoginService.forgotPassword.andCallFake(function(mail) {
                if(mail === email) mailPassed = true;
                return $q.when(true);
            });
            spyOn($state, 'go').andCallFake(stateGoSpy);

            vm.forgotPassword();
            $rootScope.$apply();

            expect(mailPassed).toBe(true);
            expect(stateGoSpy).toHaveBeenCalled();
            expect(alertSpyMethod).toHaveBeenCalled();
        });

        it('should set error message after rejecting forgot password call', function() {
            var deferred = $q.defer();

            LoginService.forgotPassword.andCallFake(function() {
                return deferred.promise;
            });

            vm.forgotPassword();

            deferred.reject();
            $rootScope.$apply();

            expect(vm.error).toEqual('msg.forgot.password.failed');
        });
    });

    it('should redirect to login page', function() {
        var stateGoSpy = jasmine.createSpy();
        spyOn($state, 'go').andCallFake(stateGoSpy);

        vm.goToLogin();

        expect(stateGoSpy).toHaveBeenCalledWith('auth.login.form');
    });

});
