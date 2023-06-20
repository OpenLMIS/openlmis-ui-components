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
     * @name openlmis-popover.directive:popoverTitle
     *
     * @description
     * Adds a watcher to set and update the popover's title element.
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
                return attrs['popoverTitle'];
            }, setTitle);

            /**
             * @ngdoc method
             * @propertyOf openlmis-popover.directive:popoverTitle
             * @name setTitle
             *
             * @param {String} title The title to set
             * 
             * @description
             * Displayed title for the popover. The title is removed if the
             * string is empty.
             */
            function setTitle(title) {
                if (title && title !== '') {
                    popoverCtrl.popoverScope.title = title;
                } else {
                    popoverCtrl.popoverScope.title = false;
                }
            }
        }
    }

})();
