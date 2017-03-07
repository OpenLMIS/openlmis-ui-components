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
     * @name openlmis-form.directive:select
     *
     * @description
     * Adds required logic to select element.
     *
     * @example
     * This directive will work with 'select' elements that have 'required' or 'ng-required' attribute.
     * It also requires 'label' element to be connected with 'select' by 'for' attribute.
     * ```
     * <label for="input-id">option</label>
     * <select id="input-id" required></select>
     * ```
     *
     * After rendering 'required' attribute will be added to 'label' element.
     * ```
     * <label for="input-id" required>option</label>
     * <input id="input-id" required></input>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('select', selectRequired);

    selectRequired.$inject = [];

    function selectRequired() {
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs) {
            if (attrs.required || (attrs.ngRequired && attrs.ngRequired !== 'false')) {
                attrs.$observe('id', function(id) {
                    element.siblings('label[for="' + id + '"]').addClass('required');
                });
            }
        }
    }

})();
