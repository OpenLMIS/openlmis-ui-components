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
     * @ngdoc directive
     * @restrict A
     * @name openlmis-offline.directive:offline
     *
     * @description
     * Directive for determining if user is online or not.
     *
     * @example
     * ```
     * <button offline ng-disabled="isOffline">Do something</button>
     * ```
     */
    angular
        .module('openlmis-offline')
        .directive('offline', offline);

    offline.$inject = ['offlineService'];

    function offline(offlineService) {
        var directive = {
            restrict: 'A',
            scope: false,
            replace: false,
            link: link
        }
        return directive;

        function link(scope, element, attr) {

            /**
             * @ngdoc property
             * @propertyOf openlmis-offline.directive:offline
             * @name isOffline
             * @type {Boolean}
             *
             * @description
             * A boolean that says if there is an internet connection, as
             * determined by the offlineService.
             */
            scope.$watch(function(){
                return offlineService.isOffline();
            }, function(isOffline) {
                scope.isOffline = isOffline;
            }, true);

            /**
             * @ngdoc property
             * @propertyOf openlmis-offline.directive:offline
             * @name checkConnection
             * @type {Boolean}
             *
             * @description
             * Makes the offlineService check if there is a connection to the internet.
             */
            scope.checkConnection = function() {
                return offlineService.checkConnection();
            };
        }
    }

})();
