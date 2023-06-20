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
     * @ngdoc directive
     * @restrict E
     * @name openlmis-table-form.directive:tdOpenlmisInvalidMessage
     *
     * @description
     * Displays the openlmis-invalid message in a popover.
     */

    angular
        .module('openlmis-table-form')
        .directive('td', directive);

    function directive() {
        return {
            restrict: 'E',
            priority: 1,
            require: ['openlmisInvalid', 'openlmisPopover'],
            link: link
        };
    }

    function link(scope, element, attrs, ctrls) {
        var openlmisPopoverCtrl = ctrls[1];

        element.on('openlmisInvalid.show', showMessage);
        element.on('openlmisInvalid.hide', hideMessage);

        function showMessage(event, messageElement) {
            event.preventDefault();

            // default placement is 10, this is higher than most elements
            openlmisPopoverCtrl.addElement(messageElement, 5);
        }

        function hideMessage(event, messageElement) {
            openlmisPopoverCtrl.removeElement(messageElement);
        }
    }

})();
