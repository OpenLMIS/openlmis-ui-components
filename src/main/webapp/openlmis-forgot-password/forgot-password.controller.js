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


(function(){

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-forgot-password.ForgotPasswordController
     *
     * @description
     * Controller that drives the forgot password form.
     */
    angular
        .module('openlmis-forgot-password')
        .controller('ForgotPasswordController', controller);

    controller.$inject = ['$state', 'loginService', 'alertService'];

    function controller($state, loginService, alertService) {

        var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            vm = this;

        vm.forgotPassword = forgotPassword;
        vm.redirectToLogin = redirectToLogin;

        /**
         * @ngdoc function
         * @name forgotPassword
         * @methodOf openlmis-forgot-password.ForgotPasswordController
         *
         * @description
         * Requests sending reset password token to email address given in form.
         */
        function forgotPassword() {
            if(validateEmail()) {
                loginService.forgotPassword(vm.email).then(function() {
                    alertService.success('email.sent.message', 'email.check.message')
                        .then(redirectToLogin);
                }, function() {
                    vm.error = 'msg.forgot.password.failed';
                });
            } else {
                vm.error = 'user.email.invalid';
            }
        }

        /**
         * @ngdoc function
         * @name redirectToLogin
         * @methodOf openlmis-forgot-password.ForgotPasswordController
         *
         * @description
         * Redirects to the login page.
         */
        function redirectToLogin(){
            $state.go('auth.login');
        }

        function validateEmail() {
            return EMAIL_REGEX.test(vm.email);
        }
    }
}());
