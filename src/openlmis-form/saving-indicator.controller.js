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
     * @name openlmis-form.controller:SavingIndicatorController
     *
     * @description
     * Controller for managing requisitions.
     */
    angular
        .module('openlmis-form')
        .controller('SavingIndicatorController', SavingIndicatorController);

    SavingIndicatorController.$inject = ['$timeout', '$scope'];

    function SavingIndicatorController($timeout, $scope) {
        var indicator = this,
            savingTimeout;

        indicator.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf openlmis-form.controller:SavingIndicatorController
         * @name message
         * @type {String}
         *
         * @description
         * Message that will be displayed on screen.
         */
        indicator.message = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-form.controller:SavingIndicatorController
         * @name iconClass
         * @type {String}
         *
         * @description
         * Class name for icon.
         */
        indicator.iconClass = undefined;

        /**
         * @ngdoc method
         * @methodOf openlmis-form.controller:SavingIndicatorController
         * @name onInit
         *
         * @description
         * Sets initial values for controller.
         */
        function onInit() {
            setSavedStatus();

            $timeout(function() {
                $scope.$watch(function() {
                    return $scope.object;
                }, function(oldValue, newValue) {
                    if (oldValue !== newValue) {
                        setSavingStatus();
                        $timeout.cancel(savingTimeout);
                        savingTimeout = $timeout(setSavedStatus, 3000);
                    }
                }, true);
            }, 1000);
        }

        function setSavedStatus() {
            indicator.message = 'form.changesSaved';
            indicator.iconClass = 'saved';
        }

        function setSavingStatus() {
            indicator.message = 'form.savingChanges';
            indicator.iconClass = 'saving';
        }
    }
})();
