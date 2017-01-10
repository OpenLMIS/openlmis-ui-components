(function() {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name openlmis-table:tbodyTitle
	 *
	 * @description
	 * Takes the title attribute from a tbody element and changes it into a stylable banner.
	 *
	 * @example
	 * To add a title heading to any tbody element, just add a title element with a translated string (this element will not translate strings for you)
	 * ```
	 * <table>
	 *   <tbody title="Category Title">
	 *     <tr><td>123</td><td>456</td></tr>
	 *     <tr><td>Foo</td><td>Bar</td></tr>
	 *   </tbody>
	 * </table>
	 * ```
	 * Which will produce the following markup
	 * ```
	 * <table>
	 *   <tbody>
	 *     <tr class="title"><td colspan="2">Category Title</td></tr>
	 *     <tr><td>123</td><td>456</td></tr>
	 *     <tr><td>Foo</td><td>Bar</td></tr>
	 *   </tbody>
	 * </table>
	 * ```
	 */
	angular
		.module('openlmis-table')
		.directive('tbody', tbodyTitle);

	tbodyTitle.$inject = [];
	function tbodyTitle() {
    	return {
      		restrict: 'E',
			replace: false,
      		link: link
    	};
    	function link(scope, element, attrs) {
    		if(attrs.title && attrs.title != ""){
    			// Assume the table is formatted correctly (and fully rendered)
    			var numCols = element.children('tr').children('td, th').length;
    			var title = attrs.title;

    			element.removeAttr('title');

    			element.prepend('<tr class="title">'
    				+ '<td colspan="' + numCols + '">' + title + '</td>'
    				+ '</tr>');

    		}
    	}
	}

})();
