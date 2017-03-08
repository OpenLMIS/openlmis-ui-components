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
     * @name openlmis-auth.accessTokenFactory
     *
     * @description
     * Functions for add/update access token.
     */
    angular.module('openlmis-auth').factory('accessTokenFactory', accessTokenFactory);

    accessTokenFactory.$inject = ['authorizationService'];

    function accessTokenFactory(authorizationService) {
        var factory = {
            updateAccessToken: updateAccessToken,
            updateQueryStringParameter: updateQueryStringParameter,
            addAccessToken: addAccessToken
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.accessTokenFactory
         * @name  addAccessToken
         *
         * @description
         * Added a get request variable to the end of the url.
         *
         * @param  {String} url A url string
         * @return {String}     A url string with access_token url parameter added
         */
        function addAccessToken(url){
            if (url.indexOf('access_token=') === -1) {
                var token = authorizationService.getAccessToken();
                if (token) {
                    url += (url.indexOf('?') === -1 ? '?' : '&') + 'access_token=' + token;
                }
            }
            return url;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.accessTokenFactory
         * @name updateAccessToken
         *
         * @description
         * Update access token in URI string.
         *
         * @param {String}  uri The URI to update
         * @return {String}     Updated uri
         */
        function updateAccessToken(uri) {
            return updateQueryStringParameter(uri, 'access_token', authorizationService.getAccessToken());
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.accessTokenFactory
         * @name updateQueryStringParameter
         *
         * @description
         * Update query parameter if exist.
         *
         * @param  {String} uri   The URI to update
         * @param  {String} key   They key of query param
         * @param  {String} value They value of query param
         * @return {String}       Updated uri
         */
        function updateQueryStringParameter(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            if (uri.match(re)) {
              return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            return uri;
        }
        return factory;
    }

})();
