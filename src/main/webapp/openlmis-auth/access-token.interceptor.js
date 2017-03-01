/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */


 (function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-auth.accessTokenInterceptor
     *
     * @description
     * Adds access token stored by the Authorization Service to all requests to the OpenLMIS Server.
     */
    angular
        .module('openlmis-auth')
        .factory('accessTokenInterceptor', factory)
        .config(config);

    config.$inject = ['$httpProvider'];

    factory.$inject = [
        '$q', '$injector', 'openlmisUrlService', 'authorizationService', 'accessTokenFactory'
    ];

    function config($httpProvider) {
        $httpProvider.interceptors.push('accessTokenInterceptor');
    }

    function factory($q, $injector, openlmisUrlService, authorizationService,
                     accessTokenFactory) {

        var interceptor = {
            request: request,
            responseError: responseError
        };
        return interceptor;

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.accessTokenInterceptor
         * @name request
         *
         * @description
         * Checks the request config url with openlmisUrlService, and if there is a match an access
         * token is added to the url.
         *
         * @param  {Object} config HTTP Config object
         * @return {Object}        A modified configuration object
         */
        function request(config) {
            if(openlmisUrlService.check(config.url) && authorizationService.isAuthenticated()
                    // we don't want to add the token to template requests
                    && !isHtml(config.url)) {
                config.url = accessTokenFactory.addAccessToken(config.url);
            }
            return config;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.accessTokenInterceptor
         * @name  responseError
         *
         * @description
         * Takes a failed response that is a 401 and clears a user's credentials, forcing them to
         * login OR takes 403 response and shows a modal with authorization error.
         *
         * @param  {Object}  response HTTP Response
         * @return {Promise}          Rejected promise
         */
        function responseError(response) {
            if (response.status === 401) {
                authorizationService.clearAccessToken();
                authorizationService.clearUser();
                authorizationService.clearRights();
            } else if (response.status === 403) {
                $injector.get('alertService').error('error.authorization');
            }
            return $q.reject(response);
        }

        function isHtml(url) {
            return url.lastIndexOf('.html') === url.length - '.html'.length;
        }
    }

})();
