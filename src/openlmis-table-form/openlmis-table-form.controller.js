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

    angular
        .module('openlmis-table-form')
        .controller('OpenlmisTableFormController', OpenlmisTableFormController);

    OpenlmisTableFormController.inject = ['$element'];

    function OpenlmisTableFormController($element) {
        var vm = this,
            errorElements = [];

        vm.$onInit = onInit;
        vm.showsErrors = showsErrors;

        function onInit() {
            $element.on('openlmisInvalid.show', addElement);
            $element.on('openlmisInvalid.hide', removeElement);
        }

        function showsErrors() {
            return errorElements.length > 0;
        }

        function addElement(event, errorElement) {
            if (errorElements.indexOf(errorElement) === -1) {
                errorElements.push(errorElement);
            }
            vm.showsErrors();
        }

        function removeElement(event, errorElement) {
            var index = errorElements.indexOf(errorElement);

            if (index > -1) {
                errorElements.splice(index, 1);
            }
            vm.showsErrors();
        }
    }

})();