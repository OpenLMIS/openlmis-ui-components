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
     * @restrict E
     * @name openlmis-form.directive:select-placeholder
     *
     * @description
     * Sets a default placeholder message on select elements, if one isn't previously set as an
     * attribute or as the first option element with an empty string as it's value.
     *
     * @example
     * ```
     * <select placeholder="Custom placeholder"></select>
     * ```
     *
     * This will also work with ngOptions and setting a placeholder with an option element that has
     * it's value set to an empty string, or has the class placeholder.
     *
     * Setting a placeholder without a value attribute will not work, because ngOption will set the
     * value to the option's text.
     * ```
     * <select ng-model="value" ng-options="for something in whatever">
     *    <option value="">Placeholder text goes here</option>
     * </select>
     * ```
     *
     * To not set a placeholder, use the no-placeholder attribute. If you don't want a placeholder,
     * you should make sure the element always has a value.
     * ```
     * <select no-placeholder>
     *   <option value="1">This will be immedately selected</option>
     *   <option value="2">This is another option</option>
     * </select>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('select', select);

    select.$inject = ['messageService'];

    function select(messageService) {
        var directive = {
            restrict: 'E',
            require: [
                'select',
                '?ngModel'
            ],
            priority: 8,
            link: link
        };
        return directive;

        function link(scope, element, attrs, ctrls) {
            if(attrs.hasOwnProperty('noPlaceholder')) {
                return ;
            }

            var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1],
                emptyOption = prepareEmptyOption();

            // Removing selectCtrl unknown option functions
            // because displaying this to users doesn't add
            // value
            var noop = function(){};
            selectCtrl.renderUnknownOption = noop;
            selectCtrl.updateUnknownOption = noop;
            selectCtrl.removeUnknownOption = noop;

            displayPlaceholder();

            element.change(updateSelectValue);

            attrs.$observe('required', displayPlaceholder);
            if(ngModelCtrl) {
                scope.$watch(function() {
                    return ngModelCtrl.$viewValue;
                }, displayPlaceholder);
            }
            
            function displayPlaceholder() {
                if(ngModelCtrl && selectCtrl.readValue() === null) {
                    emptyOption.attr('selected', 'selected');
                    emptyOption.show();
                }
            }

            function updateSelectValue() {
                var newValue = element.val();
                element.children('option[selected="selected"]').removeAttr('selected');
                element.children('option').each(function(index, option) {
                    option = angular.element(option);
                    if(option.val() == newValue) {
                        option.attr('selected', 'selected');
                    }
                });
                displayPlaceholder();
            }

            function prepareEmptyOption() {
                var emptyOption = angular.element('<option value="" disabled class="placeholder"></option>');

                element.children('option').each(function(index, option) {
                    option = angular.element(option);
                    if(!option.val() || option.val() === "") {
                        emptyOption = option;
                        option.addClass('placeholder');
                    }
                });

                if(!element.children('option.placeholder').length) {
                    element.prepend(emptyOption);
                }

                emptyOption.attr('selected', 'selected');
                emptyOption.val('');

                if(emptyOption.text() === '') {
                    if(attrs.placeholder) {
                        element.children('option.placeholder').text(attrs.placeholder);
                    } else {
                        element.children('option.placeholder').text(
                            messageService.get('openlmisForm.selectAnOption')
                        );
                    }
                }

                return element.children('option.placeholder');
            }
        }
    }

})();
