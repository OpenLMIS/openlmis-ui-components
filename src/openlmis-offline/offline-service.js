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
            isOfflineFlag = false;

        service.checkConnection = checkConnection;
        service.isOffline = isOffline;
        service.addOnlineListener = addOnlineListener;
        service.removeOnlineListener = removeOnlineListener;
        service.addOfflineListener = addOfflineListener;
        service.removeOfflineListener = removeOfflineListener;

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

        addOnlineListener(online);
        addOfflineListener(offline);

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
        function checkConnection() {
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
        function isOffline() {
            return isOfflineFlag;
        }

        function offline() {
           $timeout(function() {
               isOfflineFlag = true;
           });
        }

        function online() {
           $timeout(function() {
               isOfflineFlag = false;
           });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-offline.offlineService
         * @name addOnlineListener
         *
         * @description
         * Adds listener to is online event.
         *
         * @param {Function} listener the method that will be executed on event
         */
        function addOnlineListener(listener) {
            Offline.on('confirmed-up', listener);
            Offline.on('up', listener);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-offline.offlineService
         * @name removeOnlineListener
         *
         * @description
         * Removes listener from is online event.
         *
         * @param {Function} listener the method that will be removed
         */
        function removeOnlineListener(listener) {
            Offline.off('confirmed-up', listener);
            Offline.off('up', listener);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-offline.offlineService
         * @name addOfflineListener
         *
         * @description
         * Adds listener to is offline event.
         *
         * @param {Function} listener the method that will be executed on event
         */
        function addOfflineListener(listener) {
            Offline.on('confirmed-down', listener);
            Offline.on('down', listener);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-offline.offlineService
         * @name removeOfflineListener
         *
         * @description
         * Removes listener from is offline event.
         *
         * @param {Function} listener the method that will be removed
         */
        function removeOfflineListener(listener) {
            Offline.off('confirmed-down', listener);
            Offline.off('down', listener);
        }
    }
})();
