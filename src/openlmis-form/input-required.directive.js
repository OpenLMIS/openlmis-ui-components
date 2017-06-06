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
     * This directive will work with 'input' elements that have 'required' or 'ng-required' attribute.
     * It also requires 'label' element to be connected with 'input' by 'for' attribute. For inputs
     * of checkbox/radio type the class will be added to the legend element.
     * ```
     * <label for="input-id">option</label>
     * <input id="input-id" required></input>
     *
     * <fieldset>
     *     <legend>Legend</legend>
     *     <input type="checkbox"></input>
     * </fieldset>
     * ```
     *
     * After render required class will be added to 'label' and 'legend' elements.
     * ```
     * <label for="input-id" class="required">option</label>
     * <input id="input-id" required></input>
     *
     * <fieldset>
     *     <legend class="required">Legend</legend>
     *     <input type="checkbox"></input>
     * </fieldset>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('input', inputRequired);

    function inputRequired() {
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs) {

            if (!attrs.required && (!attrs.ngRequired || attrs.ngRequired !== 'false')) return;

            if (attrs.type === 'radio' || attrs.type === 'checkbox') {
                element.parents('fieldset').find('legend').addClass('required');
            } else {
                attrs.$observe('id', function(id) {
                    element.siblings('label[for="' + id + '"]').addClass('required');
                });
            }
        }
    }

})();
