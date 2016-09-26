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

  angular.module("openlmis")
    .controller("LoginController", LoginController);

  LoginController.$inject = ['$scope', 'AuthService', 'localStorageService', 'messageService'];

  function LoginController($scope, AuthService, localStorageService, messageService) {
    var FORGOT_PASSWORD = "/public/pages/forgot-password.html";

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

    $scope.doLogin = function() {
      if (!validateLoginForm()) {
        return;
      }

      $scope.disableSignInButton = true;
      AuthService.login($scope.username, $scope.password)
      .then(function(){
        $scope.getUserInfo();
      })
      .catch(function(){
        $scope.loginError = messageService.get("user.login.error");
      })
      .finally(function(){
        $scope.disableSignInButton = false;
        $scope.password = undefined;
      });
    };

    $scope.getUserInfo = function(userId, token) {
      AuthService.getUserInfo()
      .then(function(){
        if (window.location.href.indexOf("login.html") != -1) {
          window.location = "/public/pages/index.html";
          return;
        }
        
        //TODO: Figure out where these are used
        if (!$scope.loginConfig.preventReload) {
          location.reload();
          return;
        }
        $scope.loginConfig.modalShown = false;
        $scope.loginConfig.preventReload = false;
      })
      .catch(function(){
        $scope.loginError = messageService.get("user.authentication.error");
      });
    };

    $scope.goToForgotPassword = function() {
      window.location = FORGOT_PASSWORD;
    };

    function getRights(rightList) {
      var rights = [];
      if (!rightList) return rights;
      $.each(rightList, function(index, right) {
        rights.push({
          name: right.name,
          type: right.type
        });
      });
      return JSON.stringify(rights);
    }
  }
}());