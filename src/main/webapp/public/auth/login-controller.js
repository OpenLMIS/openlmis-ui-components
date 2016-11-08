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
  "use strict";

  /**
   * @ngdoc controller
   * @name  openlmis-auth.LoginController
   *
   * @description
   * Controller that drives the login form.
   * 
   */

  angular.module("openlmis-auth")
    .controller("LoginController", LoginController);

  LoginController.$inject = ['$scope', 'LoginService', 'localStorageService', 'messageService'];

  function LoginController($scope, LoginService, localStorageService, messageService) {
    var FORGOT_PASSWORD = "/public/pages/forgot-password.html";

    /**
     * 
     * @ngdoc property
     * @name  $scope.username
     * @propertyOf openlmis-auth.LoginController
     * @returns {string} Username
     * 
     */

    /**
     * 
     * @ngdoc property
     * @name  $scope.password
     * @propertyOf openlmis-auth.LoginController
     * @returns {string} Password
     * 
     */

    /**
     * 
     * @ngdoc property
     * @name  $scope.loginError
     * @propertyOf openlmis-auth.LoginController
     * @returns {string} Error message from attempting a logging in
     * 
     */

    /**
     * @ngdoc function
     * @name  validateLoginForm
     * @methodOf openlmis-auth.LoginController
     *
     * @returns {boolean} If login form is valid
     *
     * @description
     * Checks username and password $scope variables, and returns true or shows an appropriate error message before the actual login request happens.
     */
    var validateLoginForm = function() {
      if ($scope.username === undefined || $scope.username.trim() === '') {
        $scope.loginError = messageService.get("error.login.username");
        return false;
      }
      if ($scope.password === undefined) {
        $scope.loginError = messageService.get("error.login.password");
        return false;
      }
      return true;
    };

    /**
     * @ngdoc function
     * @name doLogin
     * @methodOf openlmis-auth.LoginController
     *
     * @description
     * Takes $scope.username and $scope.password variables and sends them to login service.
     * 
     * On error response from the login service, $scope.loginError is set.
     *
     * On success a 'auth.login' event is emitted — 
     * 
     */
    $scope.doLogin = function() {
      if (!validateLoginForm()) {
        return;
      }

      $scope.disableSignInButton = true;
      LoginService.login($scope.username, $scope.password)
      .then(function(){
        $scope.$emit('auth.login');
      })
      .catch(function(){
        $scope.loginError = messageService.get("user.login.error");
      })
      .finally(function(){
        $scope.disableSignInButton = false;
        $scope.password = undefined;
      });
    };

    /**
     * @ngdoc function
     * @name  goToForgotPassword
     * methodOf openlmis-auth.LoginController
     *
     * @description Changes location to forgot login page
     * 
     */

    $scope.goToForgotPassword = function() {
      window.location = FORGOT_PASSWORD;
    };

  }
}());