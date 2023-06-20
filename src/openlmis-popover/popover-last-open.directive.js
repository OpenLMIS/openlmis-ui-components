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
     * @restrict A
     * @name openlmis-popover.directive:lastOpen
     *
     * @description
     * Allows only one popover to be open at a time by closing the last popover
     * that opened.
     *
     * This is done by setting a global variable for the lastOpenPopover, and
     * when a new popover is open the last popover is hidden.
     */

    // This variable is seen by all instances of this directive
    var lastOpenPopover;

    angular.module('openlmis-popover')
        .directive('openlmisPopover', popoverDirective);

    popoverDirective.$inject = ['jQuery'];

    function popoverDirective(jQuery) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element) {

            element.on('show.bs.popover', function() {
                if (lastOpenPopover && lastOpenPopover !== element &&
                    !jQuery.contains(element[0], lastOpenPopover[0])) {

                    var popoverCtrl = lastOpenPopover.controller('openlmisPopover');
                    if (popoverCtrl) {
                        popoverCtrl.close();
                    }
                }
                lastOpenPopover = element;
            });

            element.on('hide.bs.popover', unsetSelfAsLastOpenPopover);

            scope.$on('$destroy', unsetSelfAsLastOpenPopover);

            function unsetSelfAsLastOpenPopover() {
                if (lastOpenPopover === element) {
                    lastOpenPopover = null;
                }
            }

        }
    }

})();
