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
     * @restrict A
     * @name openlmis-form.directive:charactersLeft
     *
     * @description
     * Provides characters left indicator under input.
     * If max characters count is reached indicator text will turn red.
     *
     * @example
     * The following can be used to extend textarea or text input elements.
     * ```
     * <textarea characters-left max-length="100" ng-model="model"></textarea>
     * ```
     * Both ng-model and max-length attributes are required.
     *
     * Rendered directive when characters limit has not been reached will look like this:
	 * ```
	 * <textarea characters-left max-length="100" ng-model="model">
	 * 	   <div class="characters-left">
	 *         <div>characters left: {{maxLength - model.length}}</div>
	 *     </div>
	 * </textarea>
	 * ```
	 * Below is how directive will be rendered when characters limit has been reached:
	 *```
	 * <textarea characters-left max-length="100" ng-model="model">
	 * 	   <div class="characters-left">
	 *         <div class="no-left">too many characters: {{text.length - maxLength}}</div>
	 *     </div>
	 * </textarea>
	 * ```
     */
	angular
		.module('openlmis-form')
		.directive('charactersLeft', directive);

	directive.$inject = ['$templateRequest', '$compile'];

	function directive($templateRequest, $compile) {
		return {
			restrict: 'A',
            require: 'ngModel',
            scope: {
                maxLength: '=',
				text: '=ngModel'
            },
            link: link
		};

        function link(scope, element, attributes, ngModelController) {

			$templateRequest('openlmis-form/characters-left.html').then(function(template) {
				var content;

				element.on('focus', function() {
					content = $compile(template)(scope);
					if (element.next().length) {
		                element.next().insertBefore(content);
		            } else {
						element.parent().append(content);
					}
				});

				element.on('blur', function() {
					if(content) content.remove();
					content = null;
				});
			});
        }
	}

})();
