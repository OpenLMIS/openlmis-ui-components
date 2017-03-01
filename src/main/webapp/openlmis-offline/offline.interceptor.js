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
     * @name openlmis-offline.offlineInterceptor
     *
     * @description
     * Responsible for managing server requests while offline.
     */
    angular
        .module('openlmis-offline')
        .factory('offlineInterceptor', factory)
        .config(config);

    config.$inject = ['$httpProvider'];

    factory.$inject = ['$q', '$injector', 'offlineService'];

    function config($httpProvider) {
        $httpProvider.interceptors.push('offlineInterceptor');
    }

    function factory($q, $injector, offlineService) {

        var canDisplayModal = true,
            interceptor = {
                request: request
            };
        return interceptor;

        /**
         * @ngdoc method
         * @methodOf openlmis-offline.offlineInterceptor
         * @name request
         *
         * @description
         * Cancels request if user is offline and displays alert modal with proper message.
         * Passes all HTML calls.
         *
         * @param  {Object} config HTTP Config object
         * @return {Object}        A modified configuration object
         */
        function request(config) {
            var canceler = $q.defer();
            config.timeout = canceler.promise;

            if(offlineService.isOffline() && config.url.indexOf('.html') < 0) { // checks if calls for html file from cache
                                                                                // because all of them are getting into that method
                if(canDisplayModal) {
                    canDisplayModal = false;
                    $injector.get('alertService').error('error.actionNotAllowedOffline').then(function() {
                        canDisplayModal = true;
                    });
                }

                canceler.resolve();
            }

            return config;
        }
    }

})();
