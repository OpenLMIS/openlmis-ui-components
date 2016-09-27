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

    angular.module('openlmis-core')
        .run(authStateChangeInjector);

    authStateChangeInjector.$inject = ['$rootScope', '$window', 'AuthService'];
    function authStateChangeInjector($rootScope, $window, AuthService){
        $rootScope.$on('$routeChangeStart', function(){
            if(!AuthService.isAuthenticated() && $window.location.href.indexOf('login.html') == -1){
                // if not authenticated and not on login page
                $window.location.assign('/public/pages/login.html');
            } else if(AuthService.isAuthenticated() && $window.location.href.indexOf('login.html') >= 0) {
                // if authenticated and on login page
                $window.location.assign('/public/pages/index.html');
            }
        });
    }

})();