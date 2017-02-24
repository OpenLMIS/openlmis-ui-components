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

    angular.module('openlmis-modal')
      .service('loadingModalService', LoadingModal);

    /**
     * @ngdoc service
     * @name  openlmis-modal.loadingModalService
     *
     * @description
     *
     * Will show and hide a loading modal that will block the UI and show a simple loading symbol.
     *
     */
     LoadingModal.$inject = ['$q', '$timeout', 'bootbox', 'messageService'];
    function LoadingModal($q, $timeout, bootbox, messageService) {
        var dialog, timeoutPromise, deferred;

        return {
              open: showModal,
              close: hideModal
        };

        /**
         * @ngdoc function
         * @name open
         * @methodOf openlmis-modal.loadingModalService
         *
         * @description Shows the loading modal after a half second delay.
         */

        function showModal(delay) {
            if (deferred) {
                return deferred.promise;
            }

            deferred = $q.defer();

            if (delay && !timeoutPromise) {
                timeoutPromise = $timeout(function(){
                    makeModal();
                    timeoutPromise = null;
                }, 500);
            } else {
                makeModal();
            }

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name close
         * @methodOf openlmis-modal.loadingModalService
         *
         * @description Hides the loading modal OR cancels the promise that was showing the modal.
         */

        function hideModal(){
            if(timeoutPromise){
                $timeout.cancel(timeoutPromise);
                timeoutPromise = null;
            }

            removeModal();

            if (deferred) {
                deferred.resolve();
                deferred = undefined;
            }
        }

        function makeModal(){
            dialog = bootbox.dialog({
                message: messageService.get('msg.loading'),
                className: 'loading-modal',
                closeButton: false
            });
        }

        function removeModal() {
            if(dialog){
                dialog.on('hidden.bs.modal', function(){
                    if(dialog) dialog.remove();
                    dialog = null;
                });
                dialog.modal('hide');
            }
        }
    }

})();
