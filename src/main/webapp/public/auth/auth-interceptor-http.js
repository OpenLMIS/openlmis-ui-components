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
    	.factory('HttpAuthAccessToken', HttpAuthAccessToken)
    	.config(httpIntercept);

    httpIntercept.$inject = ['$httpProvider'];
    function httpIntercept($httpProvider){
    	$httpProvider.interceptors.push('HttpAuthAccessToken');
    }

    HttpAuthAccessToken.$inject = ['$q', '$injector', 'OpenlmisURLService', 'AuthorizationService'];
    function HttpAuthAccessToken($q, $injector, OpenlmisURLService, AuthorizationService){

        function addAccessToken(url){
            if(url.indexOf('?access_token') == -1){
                if(url.indexOf('?') == -1){
                    url += '?access_token=' + AuthorizationService.getAccessToken();
                } else {
                    url += '&access_token=' + AuthorizationService.getAccessToken();
                }
            }
            return url;
        }

    	return {
    		request: function(config){
                if(OpenlmisURLService.check(config.url) && AuthorizationService.isAuthenticated()){
                    config.url = addAccessToken(config.url);
                }
                return config;
    		},
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    AuthorizationService.clearAccessToken();
                    AuthorizationService.clearUser();
                    AuthorizationService.clearRights();
                    $injector.get('$state').go('auth.login');
                }
                return $q.reject(response);
            }
    	}
    }

})();
