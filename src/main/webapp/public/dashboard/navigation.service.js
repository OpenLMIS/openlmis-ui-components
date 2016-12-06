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

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-dashboard.NavigationService
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
        .module('openlmis-dashboard')
        .service('NavigationService', NavigationService);

    NavigationService.$inject = ['$rootScope', '$state', '$filter', 'AuthorizationService'];

    function NavigationService($rootScope, $state, $filter, AuthorizationService) {
        var roots = initialize();

        this.getRoot = getRoot;
        this.shouldDisplay = shouldDisplay;
        this.hasChildren = hasChildren;
        this.isSubmenu = isSubmenu;

		function hasChildren(state, visibleOnly) {
            var result = false;
            angular.forEach(state.children, function(child) {
                if (visibleOnly) {
                    result = result || shouldDisplay(child);
                } else {
                    result = result || (state.children && state.children.length);
                }
            })
			return result;
		}

		function isSubmenu(state){
			return !isRoot(state) && hasChildren(state);
		}

		function shouldDisplay(state) {
			return state.showInNavigation
                && (!state.accessRight || AuthorizationService.hasRights(state.accessRight))
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
                }
            });

            for (var root in roots) {
                roots[root] = sortStates(roots[root]);
            }

            return roots;
        }

        function getRoot(name) {
            return roots[name];
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
            for (var root in roots) {
                if (roots[root].indexOf(state) !== -1) {
                    return true;
                }
            }
            return false;
        }
    }

})();
