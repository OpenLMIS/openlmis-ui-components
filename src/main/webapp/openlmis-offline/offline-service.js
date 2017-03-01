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

(function(){
    "use strict";

    /**
     * @ngdoc service
     * @name openlmis-offline.offlineService
     *
     * @description
     * Service allows to determine whether the browser can detect an internet connection.
     */

    angular.module('openlmis-offline')
        .service('offlineService', offlineService);

    offlineService.$inject = ['Offline', '$timeout', '$q'];

    function offlineService(Offline, $timeout, $q) {
        var service = this,
            isOffline = false;

        Offline.options = {
            checkOnLoad: true,
            interceptRequests: false,
            requests: false,
            checks: {xhr: {
              url: function() {
                return 'favicon.ico?_=' + new Date().getTime();
              }
            }}
        };

        Offline.on('confirmed-up', online);

        Offline.on('up', online);

        Offline.on('confirmed-down', offline);

        Offline.on('down', offline);

        /**
         * @ngdoc method
         * @methodOf openlmis-offline.offlineService
         * @name checkConnection
         *
         * @description
         * Checks periodically if user is online or not.
         *
         * @return {Promise} resolves when offline status is confirmed
         */
        service.checkConnection = function() {
            var deferred = $q.defer();

            Offline.check();

            function confirmedOnline(){
                clearEvents();
                deferred.resolve();
            }
            function confirmedOffline(){
                clearEvents();
                deferred.reject();
            }
            function clearEvents(){
                Offline.off('confirmed-up', confirmedOnline);
                Offline.off('confirmed-down', confirmedOffline);
            }

            Offline.on('confirmed-up', confirmedOnline);
            Offline.on('confirmed-down', confirmedOffline);

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-offline.offlineService
         * @name isOffline
         *
         * @return {Boolean} true if user is offline
         */
        service.isOffline = function() {
            return isOffline;
        }

        function offline() {
           $timeout(function() {
               isOffline = true;
           });
        }

        function online() {
           $timeout(function() {
               isOffline = false;
           });
        }
    }
})();
