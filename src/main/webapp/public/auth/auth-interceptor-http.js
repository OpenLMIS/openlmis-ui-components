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

    /**
     * 
     * @ngdoc service
     * @name  openlmis-auth.HttpAuthAccessTokenInterceptor
     * @description Adds access token stored by the Authorization Service to all requests to the OpenLMIS Server
     * 
     */
    angular.module('openlmis-auth')
    	.factory('HttpAuthAccessToken', HttpAuthAccessToken)
    	.config(httpIntercept);

    httpIntercept.$inject = ['$httpProvider'];
    function httpIntercept($httpProvider){
    	$httpProvider.interceptors.push('HttpAuthAccessToken');
    }

    HttpAuthAccessToken.$inject = ['$q', '$injector', 'OpenlmisURLService', 'AuthorizationService'];
    function HttpAuthAccessToken($q, $injector, OpenlmisURLService, AuthorizationService){
        /**
         * @ngdoc function
         * @name  Add access token
         * @methodOf openlmis-auth.HttpAuthAccessTokenInterceptor
         * @private
         * 
         * @param {String} url A url string
         * @returns {String} A url string with access_token url parameter added
         *
         * @description Added a get request variable to the end of the url
         */
        function addAccessToken(url){
            if (url.indexOf('?access_token') == -1){
                if (url.indexOf('?') == -1){
                    url += '?access_token=' + AuthorizationService.getAccessToken();
                } else {
                    url += '&access_token=' + AuthorizationService.getAccessToken();
                }
            }
            return url;
        }

    	return {
            /**
             * 
             * @ngdoc function
             * @name request
             * @methodOf openlmis-auth.HttpAuthAccessTokenInterceptor
             * 
             * @param  {object} config HTTP Config object
             * @return {object} A modified configuration object
             *
             * @description
             * Checks the request config url with OpenlmisURLService, and if there is a match an access token is added to the url 
             */
    		request: function(config){
                if(OpenlmisURLService.check(config.url) && AuthorizationService.isAuthenticated()
                        // we don't want to add the token to template requests
                        && !config.url.endsWith('.html')){
                    config.url = addAccessToken(config.url);
                }
                return config;
    		},
            /**
             * 
             * @ngdoc function
             * @name  response
             * @methodOf openlmis-auth.HttpAuthAccessTokenInterceptor
             * 
             * @param  {object} response HTTP Response
             * @return {Promise} Rejected promise
             *
             * @description
             * Takes a failed response that is a 401 and clears a user's credentials, forcing them to login OR takes 403 response and shows a modal with authorization error.
             * 
             */
            'responseError': function(response) {
                if (response.status === 401) {
                    AuthorizationService.clearAccessToken();
                    AuthorizationService.clearUser();
                    AuthorizationService.clearRights();
                } else if (response.status === 403) {
                    $injector.get('Alert').error('error.authorization');
                } else if(response.status === 500) {
                    $injector.get('Alert').error('msg.server.error');
                }
                return $q.reject(response);
            }
    	}
    }

})();
