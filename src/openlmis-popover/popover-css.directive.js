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
     * @name openlmis-popover.directive:popoverCss
     *
     * @description
     * Allows for css classes to be added to the openlmisPopover.
     */

    angular.module('openlmis-popover')
        .directive('openlmisPopover', popoverDirective);

    function popoverDirective() {
        return {
            restrict: 'A',
            require: 'openlmisPopover',
            link: popoverLink
        };

        function popoverLink(scope, element, attrs, popoverCtrl) {

            scope.$watch(function() {
                return attrs['popoverClass'];
            }, setCssClass);

            /**
             * @ngdoc method
             * @propertyOf openlmis-popover.directive:popoverCss
             * @name popoverClass
             *
             * @param {String} cssClass A space separated string of css classes
             * 
             * @description
             * Sets the popoverScope's popoverClass.
             */
            function setCssClass(cssClass) {
                popoverCtrl.popoverScope.cssClass = cssClass;
            }

        }
    }

})();
