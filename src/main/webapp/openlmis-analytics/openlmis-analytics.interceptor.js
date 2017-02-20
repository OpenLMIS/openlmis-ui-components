(function() {

    'use strict';

    /**
     *
     * @ngdoc service
     * @name  openlmis-analytics.analytics500Interceptor
     * @description Sends event to Google Analytics when server response status has 5xx code.
     *
     */
    angular
        .module('openlmis-analytics')
        .factory('analytics500Interceptor', factory)
        .config(config);

    config.$inject = ['$httpProvider'];
    function config($httpProvider) {
        $httpProvider.interceptors.push('analytics500Interceptor');
    }

    factory.$inject = ['$q', '$injector', '$location', 'analyticsService'];
    function factory($q, $injector, $location, analyticsService) {

        var interceptor = {
            responseError: responseError
        };
        return interceptor;

        /**
         *
         * @ngdoc function
         * @name  responseError
         * @methodOf openlmis-analytics.analytics500Interceptor
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
                analyticsService.track('send', 'event', {
                    eventCategory: '5xx Error',
                    eventAction: response.status + ' ' + response.statusText,
                    eventLabel: $location.path()
                });
            }
            return $q.reject(response);
        }
    }

})();
