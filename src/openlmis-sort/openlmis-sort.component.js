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
     * @ngdoc service
     * @name openlmis-sort.component:openlmisSort
     *
     * @description
     * The OpenLMIS sort component provides controls for API endpoints that can provide sorted content.
     * To the 'sort-options' parameter you have to provide array of sorting options in following format:
     * {
     *  display: 'display name message',
     *  value: 'nameOfTheField'
     * }
     * If you want to use sort on already existing list (not passing sort paramter to API)
     * just pass your list to 'list' parameter.
     *
     * @example
     * ```
     * <openlmis-sort
     * 	   list="vm.allItems"
     * 	   options="vm.options">
     * <openlmis-sort/>
     * ```
     */
	angular
		.module('openlmis-sort')
		.component('openlmisSort', {
			controller: 'SortController',
			controllerAs: 'sort',
            templateUrl: 'openlmis-sort/openlmis-sort.html',
			bindings: {
				list: '=?',
                sortOptions: '='
			}
		});
})();
