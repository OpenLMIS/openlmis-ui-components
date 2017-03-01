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
     * @name openlmis-navigation.directive:openlmisNavigation
     *
     * @description
     * Takes a rootState name and will render a navigation tree for that entire state,
     * this happens by the directive recursively calling its self.
     *
     * @example
     *
     * Load the top-level navigation
     * ```
     * <openlmis-navigation />
     * ```
     *
     * Load a specific state
     * ```
     * <openlmis-navigation root-state="foo" />
     * ```
     */
    angular
        .module('openlmis-navigation')
        .directive('openlmisNavigation', directive);

    directive.$inject = [];

    function directive() {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                rootState: '@?',
                states: '=?'
            },
            controller: 'NavigationController',
            controllerAs: 'vm',
            templateUrl: 'openlmis-navigation/navigation.html'
        };
        return directive;
    }

})();
