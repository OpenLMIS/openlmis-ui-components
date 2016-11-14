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
      .service('LoadingModalService', LoadingModal);

    function LoadingModal($templateCache, $templateRequest, $timeout, $q, bootbox, messageService) {
        var dialog;
        var timeoutPromise;

        return {
              open: showModal,
              close: hideModal
        };

        function showModal() {
<<<<<<< ba207b21aef11c7587eb710e7a6b58da8675ea00
            if(!dialog && !timeoutPromise){
                timeoutPromise = $timeout(function(){
                    makeModal();
                    timeoutPromise = null;
                }, 500);
=======
            console.log("showModal " + actionsActive);
            if(actionsActive > 0)
              return;
            actionsActive++;
            var deferred = $q.defer();
            console.log("showing modal");
            function makeModal() {
                var timeoutPromise;
                dialog = bootbox.dialog({
                    message: '<img src="/public/images/loader.gif">',
                    className: 'loading-modal',
                    backdrop: true,
                    onEscape: true,
                    closeButton: false
                });
                dialog.on('click.bs.modal', function(){
                    dialog.modal('hide');
                });
                dialog.on('hide.bs.modal', function(){
                    deferred.resolve();
                    if(timeoutPromise){
                        $timeout.cancel(timeoutPromise);
                    }
                });
                dialog.on('hidden.bs.modal', function(){
                    angular.element(document.querySelector('.loading-modal')).remove();
                });

                timeoutPromise = $timeout(function(){
                    dialog.modal('hide');
                }, 3000);
>>>>>>> OLMIS-1160: Repaired loading, logout bug still exists
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

<<<<<<< ba207b21aef11c7587eb710e7a6b58da8675ea00
        function makeModal(){
            dialog = bootbox.dialog({
                message: messageService.get('msg.loading'),
                className: 'loading-modal',
                backdrop: true,
                onEscape: true,
                closeButton: false
            });
=======
        function hideModal() {
            console.log("hideModal " + actionsActive);
            actionsActive--;
            console.log("hiding modal");
            dialog.modal('hide');
>>>>>>> OLMIS-1160: Repaired loading, logout bug still exists
        }

        function removeModal() {
            if(dialog){
                dialog.on('hidden.bs.modal', function(){
                    dialog.remove();
                    dialog = null;
                });
                dialog.modal('hide');
            }
        }
    }

})();