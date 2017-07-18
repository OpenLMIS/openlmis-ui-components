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
     * <textarea characters-left="true" max-length="100" ng-model="model"></textarea>
     * ```
     * Both ng-model and max-length attributes are required. The 'true' value can be added to directive
     * attribute and then this indicator will be shown always.
     *
     * Rendered directive when characters limit has not been reached will look like this:
	 * ```
	 * <textarea characters-left maxlength="100" ng-model="model">
	 * 	   <div class="characters-left">
	 *         <div>characters left: {{maxLength - model.length}}</div>
	 *     </div>
	 * </textarea>
	 * ```
	 * Below is how directive will be rendered when characters limit has been reached:
	 *```
	 * <textarea characters-left maxlength="100" ng-model="model">
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
            controller: controller,
            controllerAs: 'charactersLeftCtrl',
            link: link
		};

        function link(scope, element, attrs) {

            var charactersLeftElement;

            element.on('focus', appendElement);
            element.on('blur', destroyElement);

            scope.$on('$destroy', function(){
                destroyElement();
                element.off('focus');
                element.off('blur');
            });

            function appendElement(template) {
                if(!attrs.hasOwnProperty('charactersLeft') || attrs.charactersLeft.toLowerCase() == 'false') {
                    return ;
                }

                $templateRequest('openlmis-form/characters-left.html').then(function(template) {
                    charactersLeftElement = $compile(template)(scope);
                    if (element.parents('.input-control').length){
                        element.parents('.input-control').after(charactersLeftElement);
                    } else if (element.next().length) {
                        charactersLeftElement.insertAfter(element);
                    } else {
                        element.parent().append(charactersLeftElement);
                    }
                });
            }

            function destroyElement(){
                if(charactersLeftElement) {
                    charactersLeftElement.remove();
                    charactersLeftElement = null;
                }
            }
        }

        controller.$inject = ['$element'];
        function controller($element) {
            var ngModelCtrl = $element.controller('ngModel'),
                vm = this;

            vm.charactersLeft = true;
            vm.numberOfCharacters = 0;

            ngModelCtrl.$viewChangeListeners.push(updateCharactersLeft);

            function updateCharactersLeft() {
                var maxlength = getMaxlengthLimit();
                if(!maxlength){
                    return true;
                }

                vm.numberOfCharacters = ngModelCtrl.$viewValue.length;

                if(vm.numberOfCharacters > maxlength) {
                    vm.charactersLeft = false;
                } else {
                    vm.charactersLeft = true;
                }
            }

            function getMaxlengthLimit() {
                if($element.attr('max-length')){
                    return $element.attr('max-length');
                }
                if($element.attr('ng-maxlength')){
                    return $element.attr('ng-maxlength');
                }
                if($element.attr('maxlength')){
                    return $element.attr('maxlength');
                }
                return false;
            }
        }
	}

})();
