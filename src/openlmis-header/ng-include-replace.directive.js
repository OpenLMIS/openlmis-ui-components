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
     * @name openlmis-header.directive:ngInclude
     *
     * @description
     * Modifies the ngInclude directive to replace the element with ngInclude directive attached
     * with its content.
     *
     * @example
     * This directive can be used as normal ng-include.
     * ```
     * <div ng-include="'some-directory/replace-with.html'"></div>
     * ```
     */
    angular
        .module('openlmis-header')
        .directive('ngInclude', directive);

    function directive() {
        var directive = {
            link: link,
            priority: -1
        };
        return directive;

        function link(scope, element, attrs) {
            element.replaceWith(element.children());
        }
    }

})();
