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
     * @name openlmis-auth.ResetPasswordController
     *
     * @description
     * Controller that drives the forgot password form.
     */

    angular.module('openlmis-auth')
    .controller('ResetPasswordController', ResetPasswordController);

    ResetPasswordController.$inject = ['$state', '$stateParams', 'LoginService', 'Alert'];

    function ResetPasswordController($state, $stateParams, LoginService, Alert) {

        var vm = this;

        vm.changePassword = changePassword;

        vm.token = $stateParams.token;

        /**
         * @ngdoc function
         * @name changePassword
         * @methodOf openlmis-auth.ResetPasswordController
         *
         * @description
         * Checks if both passwords are equal and sends change password request to server.
         */
        function changePassword() {
            if(vm.password1 === vm.password2) {
                LoginService.changePassword(vm.password1, vm.token).then(function() {
                    Alert('password.reset.success');
                    $state.go('auth.login.form');
                }, function() {
                    vm.error = 'msg.change.password.failed';
                });
            } else {
                vm.error = 'error.password.mismatch';
            }
        }
    }
}());
