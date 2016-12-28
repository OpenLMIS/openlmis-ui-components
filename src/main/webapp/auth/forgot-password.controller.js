/*
* This program is part of the OpenLMIS logistics management information system platform software.
* Copyright © 2013 VillageReach
*
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
*/

(function(){
    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-auth.ForgotPasswordController
     *
     * @description
     * Controller that drives the forgot password form.
     */

    angular.module('openlmis-auth')
    .controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['$state', 'LoginService', 'Alert'];

    function ForgotPasswordController($state, LoginService, Alert) {

        var vm = this;

        vm.forgotPassword = forgotPassword;
        vm.goToLogin = goToLogin;

        /**
         * @ngdoc function
         * @name forgotPassword
         * @methodOf openlmis-auth.ForgotPasswordController
         *
         * @description
         * Requests sending reset password token to email address given in form.
         */
        function forgotPassword() {
            LoginService.forgotPassword(vm.email).then(function() {
                Alert('email.sent.message', 'email.check.message');
                goToLogin();
            }, function() {
                vm.error = 'msg.forgot.password.failed';
            });
        }

        /**
         * @ngdoc function
         * @name goToLogin
         * @methodOf openlmis-auth.ForgotPasswordController
         *
         * @description
         * Redirects to login page.
         */
        function goToLogin(){
            $state.go('auth.login.form');
        }
    }
}());
