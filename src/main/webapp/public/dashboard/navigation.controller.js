/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {
    "use strict";

    /**
     * @ngdoc controller
     * @name openlmis-dashboard.NavigationController
     *
     * @description
     *
     * Adds functionality that takes a state's label property and uses the messageService to translate it into string.
     *
     */

    angular
        .module('openlmis-dashboard')
        .controller('NavigationController', NavigationController);

    NavigationController.$inject = ['$scope', 'NavigationService']

    function NavigationController($scope, NavigationService) {
        var vm = this;

        vm.states = getStates();

        vm.hasChildren = hasChildren;
        vm.isSubmenu = NavigationService.isSubmenu;
        vm.shouldDisplay = NavigationService.shouldDisplay;

        function getStates() {
            var states = [];

            if (!$scope.rootState && !$scope.states) {
                states = NavigationService.getRoot('');
            } else if ($scope.rootState) {
                states = NavigationService.getRoot($scope.rootState);
            } else {
                states = $scope.states;
            }
            return states;
        }

        function hasChildren(state) {
            return NavigationService.hasChildren(state, true);
        }
    }

})();
