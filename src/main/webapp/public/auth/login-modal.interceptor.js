/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

 (function(){
    "use strict";

    angular.module('openlmis-auth')
        .run(loginRequiredInterceptor);

    /**
    * @ngdoc function
    * @name  openlmis-auth.loginRequiredInterceptor
    *
    * @description
    * When there is 401 unauthorized status code after request, the user is shown login modal window. After authenticate request is retried.
    *
    */
    loginRequiredInterceptor.$inject = ['$rootScope', '$compile', 'bootbox', '$templateRequest', 'authService', 'AccessTokenFactory'];
    function loginRequiredInterceptor($rootScope, $compile, bootbox, $templateRequest, authService, AccessTokenFactory) {
        var noRetryRequest;
        var dialog;

        $rootScope.$on('event:auth-loginRequired', onLoginRequired);

        /**
          *
          * @ngdoc function
          * @name onLoginRequired
          * @param {Object} event event
          * @param {boolean} noRetryRequest true if should no retry request
          *
          * @description
          * Make and show login modal, close loading modal.
          *
          */
        function onLoginRequired(event, _noRetryRequest_) {
          var scope = $rootScope.$new();
          noRetryRequest = _noRetryRequest_;

          $templateRequest('auth/login-form.html').then(function (html) {
            dialog = bootbox.dialog({
              message: $compile(html)(scope),
              closeButton: false,
              className: 'login-modal'
            });
          });
        }

        $rootScope.$on('auth.login-modal', function () {
          dialog.modal('hide');
          if (noRetryRequest === true) {
            $rootScope.$emit('event:auth-loggedIn');
          } else {
            authService.loginConfirmed(null, function (config) {
              config.url = AccessTokenFactory.updateAccessToken(config.url);
              return config;
            });
          }
        });
    }
})();
