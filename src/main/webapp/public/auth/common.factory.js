(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-auth.CommonFactory
     *
     * @description
     *
     * Common functions for auth module
     *
     */
    angular.module('openlmis-auth').factory('CommonFactory', commonFactory);

    commonFactory.$inject = ['AuthorizationService'];
    function commonFactory(AuthorizationService) {
        var factory = {
            updateAccessToken: updateAccessToken,
            updateQueryStringParameter: updateQueryStringParameter
        };

        /**
         * @ngdoc function
         * @name  updateAccessToken
         * @methodOf openlmis-auth.CommonFactory
         *
         * @description
         * Update access token in URI string
         *
         * @param {String} uri The URI to update
         * @return {String} Updated uri
         */
        function updateAccessToken(uri) {
            return updateQueryStringParameter(uri, 'access_token', AuthorizationService.getAccessToken());
        }


        /**
         * @ngdoc function
         * @name  updateQueryStringParameter
         * @methodOf openlmis-auth.CommonFactory
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
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
              return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            return uri;
        }
        return factory;
    }

})();