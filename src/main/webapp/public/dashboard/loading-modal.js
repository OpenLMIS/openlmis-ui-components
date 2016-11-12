/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

(function() {

    'use strict';

    angular.module('openlmis-core')
      .service('LoadingModal', LoadingModal);

    function LoadingModal($templateCache, $templateRequest, $timeout, $q, bootbox, messageService) {
        var dialog;
        var timeoutPromise;

        return {
              open: showModal,
              close: hideModal
        };

        function showModal() {
            if(!dialog && !timeoutPromise){
                timeoutPromise = $timeout(function(){
                    makeModal();
                    timeoutPromise = null;
                }, 500);
            }
        }

        function hideModal(){
            if(timeoutPromise){
                $timeout.cancel(timeoutPromise);
                timeoutPromise = null;
            } else if(dialog){
                removeModal();
            }
        }

        function makeModal(){
            dialog = bootbox.dialog({
                message: messageService.get('msg.loading'),
                className: 'loading-modal',
                backdrop: true,
                onEscape: true,
                closeButton: false
            });
        }

        function removeModal() {
            dialog.on('hidden.bs.modal', function(){
                dialog.remove();
                dialog = null;
            });
            dialog.modal('hide');
        }
    }

})();