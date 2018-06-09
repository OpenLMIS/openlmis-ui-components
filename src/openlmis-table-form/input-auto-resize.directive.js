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
     * @name openlmis-table-form.directive:inputAutoResize
     *
     * @description
     * Adds auto-resize option to input elements.
     *
     * @example
     * ```
     * <input ng-model="model"></input>
     * ```
     */
    angular
        .module('openlmis-table-form')
        .directive('input', inputAutoResize);

    inputAutoResize.$inject = ['$window'];

    function inputAutoResize($window) {
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element) {
            if (shouldSkipElement(element)) {
                return;
            }

            var el = element[0];
            scope.$watch(function() {
                return el.value;
            }, function() {
                $window.autosizeInput(el);
            });
        }

        function shouldSkipElement(element) {
            return element.parents().length < 2 ||
                isOutsideTd(element) ||
                isNotTextType(element);
        }

        function isOutsideTd(element) {
            var parents = element.parents();

            return parents[1].localName !== 'td' || parents[0].localName !== 'div' ||
                !parents[0].classList.contains('input-control');
        }

        function isNotTextType(element) {
            return element.attr('type') !== 'text' || element.attr('openlmis-datepicker');
        }
    }

})();
