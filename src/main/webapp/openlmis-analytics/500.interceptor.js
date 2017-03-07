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
     * @name openlmis-analytics.analytics500Interceptor
     * 
     * @description Sends event to Google Analytics when server response status has 5xx code.
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
         * @ngdoc method
         * @methodOf openlmis-analytics.analytics500Interceptor
         * @name  responseError
         *
         * @description
         * Takes a failed response with 5xx code and sends an event to Google Analytics.
         *
         * @param  {Object}  response HTTP Response
         * @return {Promise}          Rejected promise
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
