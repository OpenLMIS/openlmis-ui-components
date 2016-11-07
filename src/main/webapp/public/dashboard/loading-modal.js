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
    LoadingModal.$inject = ['bootbox'];

    function LoadingModal(bootbox) {

        var actionsActive = 0,
            loaderElement = angular.element('#loader'),
            service = {
                startLoading: add,
                finishLoading: remove
            };

//        var dialog = bootbox.dialog({
//            message: 'message',
//            className: 'loading-modal',
//            onEscape: true
//        });

        return service;

        function add() {
            //dialog.modal('show');
            openLoadingIcon();
        }

        function remove() {
            //dialog.modal('hide');
            if (--actionsActive < 1) {
                closeLoadingIcon();
            }
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