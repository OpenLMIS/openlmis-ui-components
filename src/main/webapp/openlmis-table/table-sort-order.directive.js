(function() {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name openlmis-table:tableSortOrder
	 *
	 * @description
	 * Positions the table sort order correctly in a table's container.
	 *
	 * @example
	 * ```
	 * <div class="table-container">
	 * <form table-sort-order>
	 * 	 <label for="table-sort-order">Sort items by</label>
	 *   <select id="table-sort-order">
	 *     <option selected="selected">Name</option>
	 *   </select>
	 *   <input type="submit" value="Sort items" />
	 * </form>
	 * <table>
	 *   <tbody title="Category Title">
	 *     <tr><td>123</td><td>456</td></tr>
	 *     <tr><td>Foo</td><td>Bar</td></tr>
	 *   </tbody>
	 * </table>
	 * </div>
	 * ```
	 */
	angular
		.module('openlmis-table')
		.directive('tableSortOrder', directive);

	directive.$inject = [];
	function directive() {
    	return {
      		restrict: 'AC',
			replace: false,
      		link: link
    	};
    	function link(scope, element, attrs) {
    		element.addClass('table-sort-order');
    		var parent = angular.element(element.parent()[0]);
    	}
	}

})();
