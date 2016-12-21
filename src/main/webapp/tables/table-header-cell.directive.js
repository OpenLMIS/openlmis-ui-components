(function() {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name openlmis.table:tableHeaderCell
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
