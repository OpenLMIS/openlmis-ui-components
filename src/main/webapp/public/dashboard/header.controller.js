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

  angular.module('openlmis-dashboard')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', 'localStorageService', 'loginConfig', 'ConfigSettingsByKey', '$window', 'AuthorizationService', '$http', '$state'];
  function HeaderController($scope, localStorageService, loginConfig, ConfigSettingsByKey, $window, AuthorizationService, $http, $state) {
    $scope.loginConfig = loginConfig;

    $scope.$watch(function(){
      return AuthorizationService.getUser();
    }, function(user){
      $scope.user = user.username;
      $scope.userId = user.user_id;

      $scope.hasPermission = AuthorizationService.hasPermission;
    }, true);

    /*
    var isGoogleAnalyticsEnabled = localStorageService.get('ENABLE_GOOGLE_ANALYTICS');
    // load this only once
    if (isGoogleAnalyticsEnabled === null) {

      ConfigSettingsByKey.get({
        key: 'ENABLE_GOOGLE_ANALYTICS'
      }, function(data) {
        localStorageService.add('ENABLE_GOOGLE_ANALYTICS', data.settings.value == 'true');
      });

      ConfigSettingsByKey.get({
        key: 'GOOGLE_ANALYTICS_TRACKING_CODE'
      }, function(data) {
        localStorageService.add('GOOGLE_ANALYTICS_TRACKING_CODE', data.settings.value);
      });
    }
    */

    $scope.logout = function() {
      AuthorizationService.logout()
      .then(function(){
        localStorageService.remove('ENABLE_GOOGLE_ANALYTICS');
        localStorageService.remove('GOOGLE_ANALYTICS_TRACKING_CODE');

        $.each(localStorageKeys.REPORTS, function(itm, idx) {
          localStorageService.remove(idx);
        });
        $.each(localStorageKeys.PREFERENCE, function(item, idx) {
          localStorageService.remove(idx);
        });
        $.each(localStorageKeys.DASHBOARD_FILTERS, function(item, idx) {
          localStorageService.remove(idx);
        });

        $state.reload();
      });
    };
  }

})();

