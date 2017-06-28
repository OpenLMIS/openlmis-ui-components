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
     * @name openlmis-modal.controller:AlertModalController
     *
     * @description
     * Exposes data to the alert modal view.
     */
    angular
        .module('openlmis-modal')
        .controller('AlertModalController', alertModalController);

    alertModalController.$inject = ['alertClass', 'title', 'message'];

    function alertModalController(alertClass, title, message) {
        var vm = this;

        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf openlmis-modal.controller:AlertModalController
         * @type {String}
         * @name alertClass
         *
         * @description
         * The class of the alert. Natively supported values are 'error', 'warning' and 'success'.
         */
        vm.alertClass = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-modal.controller:AlertModalController
         * @type {String}
         * @name title
         *
         * @description
         * The title of the alert, can be a message key.
         */
        vm.title = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-modal.controller:AlertModalController
         * @type {String}
         * @name message
         *
         * @description
         * The message to be shown on the alert, can be a message key.
         */
        vm.message = undefined;

        /**
         * @ngdoc method
         * @methodOf openlmis-modal.controller:AlertModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the AlertModalController. Exposes data to the view.
         */
        function onInit() {
            vm.alertClass = alertClass;
            vm.title = title;
            vm.message = message;
        }
    }

})();
