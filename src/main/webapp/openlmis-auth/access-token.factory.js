(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-auth.accessTokenFactory
     *
     * @description
     *
     * Functions for add/update access token
     *
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
         * @ngdoc function
         * @name  Add access token
         * @methodOf openlmis-auth.accessTokenFactory
         * @private
         *
         * @description Added a get request variable to the end of the url
         *
         * @param {String} url A url string
         * @returns {String} A url string with access_token url parameter added
         *
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
         * @ngdoc function
         * @name  updateAccessToken
         * @methodOf openlmis-auth.accessTokenFactory
         *
         * @description
         * Update access token in URI string
         *
         * @param {String} uri The URI to update
         * @return {String} Updated uri
         */
        function updateAccessToken(uri) {
            return updateQueryStringParameter(uri, 'access_token', authorizationService.getAccessToken());
        }

        /**
         * @ngdoc function
         * @name  updateQueryStringParameter
         * @methodOf openlmis-auth.accessTokenFactory
         *
         * @description
         * Update query parameter if exist
         *
         * @param {String} uri The URI to update
         * @param {String} key They key of query param
         * @param {String} value They value of query param
         * @return {String} Updated uri
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
