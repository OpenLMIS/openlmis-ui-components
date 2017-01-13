(function() {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name openlmis-table:tablePinnedColumns
	 *
	 * @description
	 * Allows user to pinn columns to the left side of table.
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
	 * <table table-pinned-columns>
	 *   <tbody title="Category Title">
	 *     <tr><td class="pinned">123</td><td class="pinned">456</td></tr>
	 *     <tr><td>Foo</td><td>Bar</td></tr>
	 *   </tbody>
	 * </table>
	 * </div>
	 * ```
	 */
	angular
		.module('openlmis-table')
		.directive('tablePinnedColumns', directive);

	directive.$inject = [];
	function directive() {

    	return {
      		restrict: 'A',
			replace: false,
			priority: 1,
      		link: link
    	};

    	function link(scope, element, attrs) {

			var parent = angular.element(element.parent()[0]);

            parent.on('scroll', function(){
				var pinnedCellsQuery = document.getElementsByClassName("pinned");

				angular.forEach(pinnedCellsQuery, function(cell) {
					var offset = parent[0].scrollLeft,
						el = angular.element(cell)[0].previousSiblingElement;

					while(el) {
						offset + angular.element(cell).previousSiblingElement.width;
						el = angular.element(cell)[0].previousSiblingElement;
					}

					angular.element(cell).css('left', offset + 'px');
				});
            });
    	}
	}

})();
