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
     * @ngdoc controller
     * @name openlmis-app-cache.controller:OpenlmisAppCacheController
     *
     * @description
     * Controller for managing OpenlmisAppCacheComponent. Keeps track of whether UI is up to date
     * or not.
     */
    angular
        .module('openlmis-app-cache')
        .controller('OpenlmisAppCacheController', OpenlmisAppCacheController);

    OpenlmisAppCacheController.$inject = [
        '$window', 'confirmService', '$rootScope', 'OPENLMIS_BUILD_DATE'
    ];

    function OpenlmisAppCacheController($window, confirmService, $rootScope, OPENLMIS_BUILD_DATE) {
        var vm = this,
            appCache = $window.applicationCache;

        vm.$onInit = onInit;
        vm.updateCache = updateCache;

        /**
         * @ngdoc property
         * @propertyOf openlmis-app-cache.controller:OpenlmisAppCacheController
         * @type {boolean}
         * @name updateReady
         *
         * @description
         * Flag defining whether software update is ready.
         */
        vm.updateReady = undefined;

        /**
         * @ngdoc method
         * @methodOf openlmis-app-cache.controller:OpenlmisAppCacheController
         * @name $onInit
         *
         * @description
         * Initialization method of the OpenlmisAppCacheController.
         */
        function onInit() {
            appCache.addEventListener('updateready', setUpdateReady);
            vm.buildDate = OPENLMIS_BUILD_DATE;
            setUpdateReady();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-app-cache.controller:OpenlmisAppCacheController
         * @name updateCache
         *
         * @description
         * Prompts the user to chose update options. User can either update the UI right away or can
         * choose to do it on logout/reload.
         */
        function updateCache() {
            if (!vm.updateReady) {
                return;
            }

            confirmService.confirm(
                'openlmisAppCache.cacheUpdate.message',
                'openlmisAppCache.cacheUpdate.label',
                'openlmisAppCache.cacheUpdate.cancel',
                'openlmisAppCache.cacheUpdate.title'
            )
            .then(function() {
                appCache.swapCache();
                $window.location.reload();
            })
            .catch(function(error) {
                appCache.swapCache();
                $rootScope.$on('openlmis-auth.logout', function() {
                    $window.location.reload();
                });
            })
            .finally(setUpdateReady);
        }

        function setUpdateReady() {
            vm.updateReady = appCache.status === appCache.UPDATEREADY;
        }

    }

})();
