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
  .run(authStateChangeInterceptor)
  .run(loginRequiredInterceptor);

  /**
    * @ngdoc function
    * @name  openlmis-auth.authStateChangeInterceptor
    *
    * @description
    * When the UI-Router starts a state change, then the user's authentication is checked. If the user isn't authenticated, then they are shown the login page or login modal.
    *
    * Any route that the user visits within the openlmis-auth module they will be allowed to visit if they are not authenticated. Meaning if a user is authenticated, they won't be able to access the login or forgot password screens.
    *
    */
  authStateChangeInterceptor.$inject = ['$rootScope', '$state', 'AuthorizationService', 'InterceptorService'];
  function authStateChangeInterceptor($rootScope, $state, AuthorizationService, InterceptorService) {
    $rootScope.$on('$stateChangeStart', redirectAuthState);

    function redirectAuthState(event, toState, toParams, fromState, fromParams) {
      if(!AuthorizationService.isAuthenticated() && toState.name.indexOf('auth') != 0 && toState.name.indexOf('home') != 0){
        // if not authenticated and not on login page or home page
        event.preventDefault();
        InterceptorService.onLoginRequired(true);
      } else if(!AuthorizationService.isAuthenticated() &&  toState.name.indexOf('home') == 0){
        // if not authenticated and on home page
        event.preventDefault();
        $state.go('auth.login');
      } else if(AuthorizationService.isAuthenticated() && toState.name.indexOf('auth') == 0) {
        // if authenticated and on login page
        event.preventDefault();
        $state.go('home');
      }
    }

    $rootScope.$on('auth.login', function(){
      $state.go('home');
    });
  }

  /**
    * @ngdoc function
    * @name  openlmis-auth.loginRequiredInterceptor
    *
    * @description
    * When there is 401 unauthorized status code after request, the user is shown login modal window. After authenticate request is retried.
    *
    */
  loginRequiredInterceptor.$inject = ['$rootScope', 'InterceptorService'];
  function loginRequiredInterceptor($rootScope, InterceptorService) {
    $rootScope.$on('event:auth-loginRequired', InterceptorService.onLoginRequired);
  }

})();
