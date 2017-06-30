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
     * @name openlmis-form.directive:input
     *
     * @description
     * Adds styles and logic for required input.
     *
     * @example
     * This directive will work with 'input' elements that have 'required'
     * attribute. It also requires 'label' element to be connected with 'input'
     * by 'for' attribute.
     * 
     * ```
     * <label for="input-id">option</label>
     * <input id="input-id" required></input>
     * ```
     *
     * After render required class will be added to 'label' elements.
     * 
     * ```
     * <label for="input-id" class="is-required">option</label>
     * <input id="input-id" required></input>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('input', inputRequired)
        .directive('select', inputRequired)
        .directive('textarea', inputRequired);

    function inputRequired() {
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs) {
            var label; // keep the last found label reference here (incase something changes)

            if(attrs.type === 'radio' || attrs.type === 'checkbox') {
                return;
            }

            scope.$watch(function(){
                if(attrs.hasOwnProperty('required')){
                    return attrs.required;
                } else {
                    return false;
                }
            }, update);
            scope.$watch(function(){
                return attrs.id;
            }, update);

            function update(){
                if(label){
                    label.removeClass('is-required');
                }

                if (attrs.required) {
                    label = angular.element('label[for="' + element.attr('id') + '"]');
                    label.addClass('is-required');
                }
            }
        }
    }

})();
