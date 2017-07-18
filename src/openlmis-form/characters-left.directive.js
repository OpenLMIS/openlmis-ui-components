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
     * <textarea characters-left ng-maxlength="100" ng-model="model"></textarea>
     * ```
     *
     * This element will work without ngModel.
     *
     * ng-maxlength is supported, rather than maxlength, which the browser uses
     * to have its own restrictions. 
     */
	angular
		.module('openlmis-form')
		.directive('charactersLeft', directive);

	directive.$inject = ['$templateRequest', '$compile', '$timeout'];

	function directive($templateRequest, $compile, $timeout) {
		return {
			restrict: 'A',
            require: ['charactersLeft', '?ngModel'],
            controller: 'CharactersLeftController',
            controllerAs: 'charactersLeftCtrl',
            link: link
		};

        function link(scope, element, attrs, ctrls) {
            var charactersLeftElement,
                charactersLeftCtrl = ctrls[0],
                ngModelCtrl = ctrls[1];

            makeElement();

            element.on('focus', appendElement);
            element.on('blur', removeElement);
            element.on('keypress', updateCharactersLeft);

            scope.$on('$destroy', function(){
                removeElement();
                charactersLeftElement = null;

                element.off('focus', appendElement);
                element.off('blur', removeElement);
                element.off('keypress', updateCharactersLeft);
            });

            if(ngModelCtrl){
                ngModelCtrl.$viewChangeListeners.push(updateCharactersLeft);
            }

            scope.$watch(function(){
                return attrs.ngMaxlength;
            }, function(maxlength){
                charactersLeftCtrl.maxlength = maxlength;
                updateCharactersLeft();
            });

            var updateDebounce;
            function updateCharactersLeft() {
                if(updateDebounce) {
                    $timeout.cancel(updateDebounce);
                }
                updateDebounce = $timeout(function() {
                    updateDebounce = false;
                    charactersLeftCtrl.updateCharactersLeft();
                }, 100);
            }

            function makeElement() {
                return $templateRequest('openlmis-form/characters-left.html').then(function(template) {
                    var elementScope = scope.$new()
                    elementScope.charactersLeftCtrl = charactersLeftCtrl;

                    charactersLeftElement = $compile(template)(elementScope);

                    charactersLeftCtrl.charactersLeftElement = charactersLeftElement;

                    return charactersLeftElement;
                });
            }

            function appendElement(template) {
                if(element.attr('characters-left').toLowerCase() === 'false') {
                    return;
                }

                if(charactersLeftElement.parents().length !== 0){
                    return;
                }

                if (element.parents('.input-control').length){
                    if(element.parents('.input-control').next('.openlmis-invalid').length > 0){
                        element.parents('.input-control').next('.openlmis-invalid').after(charactersLeftElement);
                    } else {
                        element.parents('.input-control').after(charactersLeftElement);
                    }
                } else if (element.next().length) {
                    charactersLeftElement.insertAfter(element);
                } else {
                    element.parent().append(charactersLeftElement);
                }
            }

            function removeElement(){
                charactersLeftElement.remove();
            }
        }
	}

})();
