/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with service program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-navigation.NavigationStateService
     *
     * @description
     * Reads routes set in UI-Router and returns all routes that are visible to the user.
     *
     * When writting UI-Router routes, set the route with 'showInNavigation: true' which will add the route to the navigation service. The parent state from the UI-Router definition is used to create a hiearchy for navigation states.
     *
     * TODO: Check if a user has authorization to view the URL
     *
     */

    angular
        .module('openlmis-navigation')
        .service('NavigationStateService', NavigationStateService);

    NavigationStateService.$inject = ['$state', '$filter', 'AuthorizationService'];

    function NavigationStateService($state, $filter, AuthorizationService) {
        var service = this;

        service.shouldDisplay = shouldDisplay;
        service.hasChildren = hasChildren;
        service.isSubmenu = isSubmenu;

        service.roots = initialize();

		function hasChildren(state) {
            var result = false;
            angular.forEach(state.children, function(child) {
                result = result || shouldDisplay(child);
            })
			return result;
		}

		function isSubmenu(state){
			return !isRoot(state) && hasChildren(state);
		}

		function shouldDisplay(state) {
			return state.showInNavigation
                && (!state.accessRights || AuthorizationService.hasRights(state.accessRights))
                && (!state.abstract || hasChildren(state, true));
		}

        function initialize() {
            var roots = {}

            $state.get().forEach(function(state) {
                if (state.showInNavigation) {
                    var parentName = getParentStateName(state);

                    var filtered = $filter('filter')($state.get(), {
                        name: parentName
                    }, true);

                    var parent = filtered[0];
                    if (parent.showInNavigation) {
                        addChildState(parent, state);
                    } else {
                        addToRoots(roots, parentName, state);
                    }

                    state.priority = state.priority !== undefined ? state.priority : 10;
                }
            });

            for (var root in roots) {
                roots[root] = sortStates(roots[root]);
            }

            return roots;
        }

        function getParentStateName(state) {
            var lastDot = state.name.lastIndexOf('.');
            return lastDot ? state.name.substring(0, lastDot) : '';
        }

        function addChildState(parent, state) {
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(state);
        }

        function addToRoots(roots, parentName, state) {
            if (!roots[parentName]) {
                roots[parentName] = [];
            }
            roots[parentName].push(state);
        }

        function sortStates(states) {
            var sorted = $filter('orderBy')(states, ['-priority', 'name']);
            sorted.forEach(function(state) {
                if (state.children) {
                    state.children = sortStates(state.children);
                }
            });
            return sorted;
        }

        function isRoot(state) {
            for (var root in service.roots) {
                if (service.roots[root].indexOf(state) !== -1) {
                    return true;
                }
            }
            return false;
        }
    }

})();
