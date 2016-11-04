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
<<<<<<< 7443520fda4a52788841455c827842ca2b1133ed
      .service('LoadingModal', LoadingModal);

    LoadingModal.$inject = ['$templateCache', '$templateRequest', '$timeout', '$q', 'bootbox'];

    function LoadingModal($templateCache, $templateRequest, $timeout, $q, bootbox) {
        var actionsActive = 0;
        var dialog;

        var service = {
              startLoading: showModal,
              stopLoading: hideModal
        };

        function showModal() {
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

 //               timeoutPromise = $timeout(function(){
//                    dialog.modal('hide');
//                }, 3000);
            }
            makeModal();

            return deferred.promise;
        }

        function hideModal() {
            console.log("hiding modal");
            dialog.modal('hide');
        }

        return service;
=======
      .service('LoadingModal', loadingModal);

    function loadingModal() {

        var actionsActive = 0,
            loaderElement = angular.element('#loader'),
            service = {
                startLoading: add,
                finishLoading: remove
            };

        return service;

        function add() {
            openLoadingIcon();
        }

        function remove() {
            if (--actionsActive < 1)
                closeLoadingIcon();
        }

        function openLoadingIcon() {
            angular.element('#loader').show();
        }

        function closeLoadingIcon() {
            angular.element('#loader').hide();
        }
>>>>>>> OLMIS-1160: Merge with master branch, minor improvements
    }

})();