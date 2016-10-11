/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function(){
	"use strict";

	angular.module('openlmis-dashboard')
		.directive('openlmisNavigation', navigation);

	navigation.$inject = ['NavigationService'];
	function navigation(NavigationService){
		return {
			restrict: 'E',
			replace: true,
			scope: {
				rootState: "="
			},
			controller: 'NavigationController as NavigationCtrl',
			templateUrl: 'dashboard/navigation.html',
			link: function(scope, element, attrs){
				var states = [];
				if(scope.rootState && scope.rootState != ""){
					states = NavigationService.get(scope.rootState);
				} else {
					states = NavigationService.getMain();
				}
				scope.states = states;

				scope.hasChildStates = function(stateName){
					var states = NavigationService.get(stateName);
					if(states.length > 0){
						return true;
					} else {
						return false;
					}
				}
			}
		}
	}

})();
