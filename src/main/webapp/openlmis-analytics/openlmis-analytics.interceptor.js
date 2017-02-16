(function() {

    'use strict';

    /**
     *
     * @ngdoc service
     * @name  openlmis-analytics.analyticsInterceptor
     * @description Sends event to Google Analytics when server response status has 5xx code.
     *
     */
    angular
        .module('openlmis-analytics')
        .factory('analyticsInterceptor', factory)
        .config(config);

    config.$inject = ['$httpProvider'];

    factory.$inject = ['$q', '$injector', '$window', '$location'];

    function config($httpProvider) {
        $httpProvider.interceptors.push('analyticsInterceptor');
    }

    function factory($q, $injector, $window, $location) {

        var interceptor = {
            responseError: responseError
        };
        return interceptor;

        /**
         *
         * @ngdoc function
         * @name  responseError
         * @methodOf openlmis-analytics.analyticsInterceptor
         *
         * @param  {object} response HTTP Response
         * @return {Promise} Rejected promise
         *
         * @description
         * Takes a failed response with 5xx code and sends an event to Google Analytics.
         *
         */
        function responseError(response) {
            if (response.status >= 500) {
                console.log('Got ' + response.status + ' error')
                $window.ga('send', 'event', {
                    eventCategory: '5xx Error',
                    eventAction: response.status + ' ' + response.statusText,
                    eventLabel: $location.path()
                });
            }
            return $q.reject(response);
        }
    }

})();
