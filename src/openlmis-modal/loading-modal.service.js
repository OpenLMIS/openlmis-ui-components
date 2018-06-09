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
        var deferred, timeoutPromise, dialog, options = {
                backdrop: 'static',
                templateUrl: 'openlmis-modal/loading-modal.html'
            },
            service = this;

        this.open = open;
        this.close = close;
        this.whenClosed = whenClosed;
        this.isOpened = false;

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
                timeoutPromise = $timeout(function() {
                    service.isOpened = true;
                    dialog = openlmisModalService.createDialog(angular.copy(options));
                    timeoutPromise = null;
                }, 500);
            } else {
                service.isOpened = true;
                dialog = openlmisModalService.createDialog(angular.copy(options));
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
        function close() {
            service.isOpened = false;

            if (timeoutPromise) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = null;
            }

            if (dialog) {
                dialog.closed = true;
                dialog.hide();
                dialog = undefined;
            }

            if (deferred) {
                deferred.resolve();
                deferred = undefined;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.loadingModalService
         * @name whenClosed
         *
         * @description
         * Returns a promise resolved when loading modal is closed. The resolved promise is returned
         * if modal is closed.
         * 
         * @return {Promise}    the promise resolved when the modal is closed
         */
        function whenClosed() {
            if (deferred) {
                return deferred.promise;
            }
            return $q.resolve();
        }
    }

})();
