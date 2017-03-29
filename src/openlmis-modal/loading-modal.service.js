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
     * @name openlmis-modal.loadingModalService
     *
     * @description
     * Will show and hide a loading modal that will block the UI and show a simple loading symbol.
     */
    angular.module('openlmis-modal')
        .service('loadingModalService', LoadingModal);

    LoadingModal.$inject = ['$q', '$timeout', 'openlmisModalService'];
    function LoadingModal($q, $timeout, openlmisModalService) {
        var deferred, timeoutPromise, dialog = openlmisModalService.createDialog({
            backdrop: 'static',
            show: false,
            templateUrl: 'openlmis-modal/loading-modal.html'
        });

        this.open = open;
        this.close = close;

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.loadingModalService
         * @name open
         *
         * @description
         * Shows the loading modal after a half second delay.
         *
         * @param  {Boolean} delay indicates if modal should be displayed with delay
         * @return {Promise}       modal promise
         */
        function open(delay) {
            if (deferred) {
                return deferred.promise;
            }

            deferred = $q.defer();

            if (delay && !timeoutPromise) {
                timeoutPromise = $timeout(function(){
                    dialog.show();
                    timeoutPromise = null;
                }, 500);
            } else {
                dialog.show();
            }

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.loadingModalService
         * @name close
         *
         * @description
         * Hides the loading modal OR cancels the promise that was showing the modal.
         */
        function close(){
            if(timeoutPromise){
                $timeout.cancel(timeoutPromise);
                timeoutPromise = null;
            }

            dialog.hide();

            if (deferred) {
                deferred.resolve();
                deferred = undefined;
            }
        }
    }

})();
