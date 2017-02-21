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
     * @name requisition-view.RequisitionWatcher
     *
     * @description
     * Provides auto-save feature to the requisition. Notifies when changes are being made to the
     * watched requisition - this can be avoided by silencing the watcher.
     */
    angular
        .module('requisition-view')
        .factory('RequisitionWatcher', factory);

    factory.$inject = ['$rootScope', '$timeout', 'notificationService', 'localStorageFactory'];

    function factory($rootScope, $timeout, notificationService, localStorageFactory) {

        RequisitionWatcher.prototype.makeSilent = makeSilent;
        RequisitionWatcher.prototype.makeLoud = makeLoud;

        return RequisitionWatcher;

        function RequisitionWatcher(scope, requisition) {
            var watcher = this,
                storage = localStorageFactory('requisitions');

            watcher.isLoud = true;

            scope.$watch(function() {
                return requisition.requisitionLineItems;
            }, function(oldValue, newValue) {
                if (oldValue !== newValue) {
                    $timeout.cancel(watcher.notificationTimeout);
                    watcher.notificationTimeout = $timeout(function() {
                        if (watcher.isLoud) {
                            notificationService.success('msg.requisitionSaved');
                            watcher.notificationTimeout = undefined;
                        }
                    }, 3000);

                    $timeout.cancel(watcher.syncTimeout);
                    watcher.syncTimeout = $timeout(function() {
                        requisition.$modified = true;
                        storage.put(requisition);
                        watcher.syncTimeout = undefined;
                    }, 500)
                }
            }, true);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.RequisitionWatcher
         * @name makeSilent
         *
         * @description
         * Makes the watcher silent - no notification will be displayed after this method has been
         * called.
         */
        function makeSilent() {
            var watcher = this;
            $timeout.cancel(watcher.notificationTimeout);
            watcher.isLoud = false;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.RequisitionWatcher
         * @name makeLoud
         *
         * @description
         * Makes the watcher loud - notification will be shown once in a while when editing the
         * watched requisition.
         */
        function makeLoud() {
            this.isLoud = true;
        }
    }

})();
