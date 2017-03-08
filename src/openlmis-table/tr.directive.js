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
	 * @restrict 'E'
	 * @name openlmis-table.directive:tableHeaderCell
	 *
	 * @description
	 * Adds `scope` attributes to table heading cells to meet [accessibility
	 * guidelines for table headings.](http://webaim.org/techniques/tables/data#th)
	 *
	 * @example
	 * All you need to do is write a table in a lazy way, and this directive
	 * will add scope attribues as needed.
	 *
	 * This directive will also change the first element in each a row if a
	 * `<th>` element isn't defined in the row.
	 *
	 * ```
	 * <table>
	 * 	 <thead>
	 *   	<tr>
	 *   	  <th>First Number</th>
	 *   	  <th>Second Number</th>
	 *   	</tr>
	 *   </thead>
	 *   <tbody>
	 *     <tr><td>123</td><td>456</td></tr>
	 *     <tr><td>Foo</td><td>Bar</td></tr>
	 *   </tbody>
	 * </table>
	 *
	 */
	angular
		.module('openlmis-table')
		.directive('tr', directive);

	directive.$inject = [];
	function directive() {
    	return {
      		restrict: 'E',
			replace: false,
      		link: link
    	};
    	function link(scope, element, attrs) {
    		var scopeType = "row";
    		if(element.parent('thead:first').length > 0){
    			scopeType = "col";
    		}

    		if(element.children('th').length < 1){
    			// update table row type
    		}

    		element.children('th').attr('scope', scopeType);
    	}
	}

})();
