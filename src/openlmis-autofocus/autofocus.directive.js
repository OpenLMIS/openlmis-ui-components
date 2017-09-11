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
     * @name openlmis-autofocus.autofocus
     *
     * @description
     * Responsible for automatically focus on proper html element.
     *
     * @example
     * Here we extend our input with the directive.
     * ```
     * <input id="login-username" ng-model="vm.username" type="text" required autofocus/>
     * ```
     */
    angular
        .module('openlmis-autofocus', [])
        .directive('autofocus', directive);

        directive.$inject = ['$timeout'];

        function directive($timeout) {

            var directive = {
                restrict: 'A',
                link: link
            };
            return directive;

            function link($scope, $element) {
                $timeout(function() {
                    $element[0].focus();
                }, 300);
            }
        }
})();