/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
function LoginController($scope, $http, localStorageService, messageService, authServerClientFactory) {
  var FORGOT_PASSWORD = "/public/pages/forgot-password.html";

  authServerClientFactory.getCredentials().then(function(data) {
    $scope.clientId = data["auth.server.clientId"];
    $scope.clientSecret = data["auth.server.clientSecret"];
  });

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
    var data = btoa($scope.clientId + ":" + $scope.clientSecret);

    $http({
      method: 'POST',
      url: '/auth/oauth/token?grant_type=password&username=' + $scope.username + '&password=' + $scope.password,
      headers: {
        "Authorization": "Basic " + data
      }
    }).success(function(data) {
      localStorageService.add(localStorageKeys.ACCESS_TOKEN, data.access_token);
      localStorageService.add(localStorageKeys.USER_ID, data.referenceDataUserId);
      $scope.disableSignInButton = false;
      $scope.password = undefined;
      $scope.getUserInfo();
    }).error(function(data) {
      $scope.disableSignInButton = false;
      $scope.loginError = messageService.get("user.login.error");
      $scope.password = undefined;
    });
  };

  $scope.getUserInfo = function(userId, token) {
    $http({
      method: 'GET',
      url: '/auth/api/users/search/findOneByReferenceDataUserId?referenceDataUserId=' +
        localStorageService.get(localStorageKeys.USER_ID) + '&access_token=' +
        localStorageService.get(localStorageKeys.ACCESS_TOKEN),
      headers: {
        "Content-Type": "application/json"
      }
    }).success(function(data) {
      localStorageService.add(localStorageKeys.USERNAME, data.username);
      //TODO: Get user's rights. For now they are hardcoded.
      //localStorageService.add(localStorageKeys.RIGHT, getRights(data.rights));
      var rights = [{
        "name": "DELETE_REQUISITION",
        "type": "REQUISITION"
      }, {
        "name": "MANAGE_DISTRIBUTION",
        "type": "ALLOCATION"
      }, {
        "name": "CREATE_REQUISITION",
        "type": "REQUISITION"
      }, {
        "name": "VIEW_ORDER",
        "type": "FULFILLMENT"
      }, {
        "name": "MANAGE_EQUIPMENT_INVENTORY",
        "type": "REQUISITION"
      }, {
        "name": "MANAGE_STOCK",
        "type": "REQUISITION"
      }, {
        "name": "AUTHORIZE_REQUISITION",
        "type": "REQUISITION"
      }, {
        "name": "VIEW_REQUISITION",
        "type": "REQUISITION"
      }, {
        "name": "APPROVE_REQUISITION",
        "type": "REQUISITION"
      }, {
        "name": "FACILITY_FILL_SHIPMENT",
        "type": "FULFILLMENT"
      }, {
        "name": "MANAGE_POD",
        "type": "FULFILLMENT"
      }, {
        "name": "VIEW_STOCK_ON_HAND",
        "type": "REQUISITION"
      }, {
        "name": "MANAGE_SUPERVISED_EQUIPMENTS",
        "type": "REQUISITION"
      }, {
        "name": "CONVERT_TO_ORDER",
        "type": "FULFILLMENT"
      }];
      var rightsJson = JSON.stringify(rights);
      localStorageService.add(localStorageKeys.RIGHT, rightsJson);

      if (window.location.href.indexOf("login.html") != -1) {
        window.location = "/public/pages/index.html";
        return;
      }

      if (!$scope.loginConfig.preventReload) {
        location.reload();
        return;
      }
      $scope.loginConfig.modalShown = false;
      $scope.loginConfig.preventReload = false;

    }).error(function(data) {
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