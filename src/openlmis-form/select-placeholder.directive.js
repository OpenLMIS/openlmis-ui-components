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

(function(){

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
        return {
            restrict: 'E',
            replace: false,
            require: ['select', '?ngModel'],
            link: function(scope, element, attrs, ctrls){
                if('noPlaceholder' in attrs) return;

                var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1];

                var emptyOption = angular.element('<option value="" class="placeholder"></option>');
                var clearLink = angular.element('<a class="clear" href="#">' + messageService.get('select.clear') + '</a>');

                var emptyValue = undefined;

                dispayPlaceholder();
                element.change(updateSelectValue);
                if(ngModelCtrl){
                    scope.$watch(function(){
                        return ngModelCtrl.$viewValue;
                    }, function(value){
                        if(!element.hasClass('pop-out')) selectCtrl.writeValue(value);
                        dispayPlaceholder();
                    });
                }

                function dispayPlaceholder(){
                    if(!element.children('option[selected="selected"]:not(.placeholder)').length){
                        createEmptyOption();
                        clearLink.remove();
                    } else if (attrs['required']) {
                        clearLink.remove();
                        emptyOption.remove();
                    } else {
                        emptyOption.remove()
                        clearLink.insertAfter(element);
                        clearLink.click(clearSelectValue);
                    }
                }

                function createEmptyOption(){
                    element.children('option').each(function(index, option){
                        option = angular.element(option);
                        if(!option.val() || option.val() == ""){
                            emptyOption = option;
                            option.addClass('placeholder');
                        }
                    });
                    if(!element.children('option.placeholder').length){
                        element.prepend(emptyOption);
                    }
                    emptyOption.attr('selected', 'selected');

                    if(emptyOption.text()==''){
                        if(attrs.placeholder){
                            element.children('option.placeholder').text(attrs.placeholder);
                        } else {
                            element.children('option.placeholder').text(messageService.get('select.placeholder.default'));
                        }
                    }
                }

                function updateSelectValue(){
                    var newValue = element.val();
                    element.children('option[selected="selected"]').removeAttr('selected');
                    element.children('option').each(function(index, option){
                        option = angular.element(option);
                        if(option.val() == newValue){
                            option.attr('selected', 'selected');
                        }
                    });
                    dispayPlaceholder();
                }

                function clearSelectValue(event){
                    event.preventDefault();
                    element.children('option[selected="selected"]').removeAttr('selected');
                    if(ngModelCtrl){
                        ngModelCtrl.$setViewValue(emptyValue);
                    }
                    dispayPlaceholder();
                }
            }
        };
    }

})();
