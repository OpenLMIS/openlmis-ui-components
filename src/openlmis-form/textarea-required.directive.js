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
     * @name openlmis-form.directive:textarea
     *
     * @description
     * Adds styles and logic for required textarea.
     *
     * @example
     * This directive will work with 'textarea' elements that have 'required' or 'ng-required'
     * attribute. It also requires 'label' element to be connected with 'textarea' by 'for'
     * attribute.
     * ```
     * <label for="textarea-id">option</label>
     * <textarea id="textarea-id" required></textarea>
     * ```
     *
     * After render required attribute will be added to 'label' element.
     * ```
     * <label for="textarea-id" required>option</label>
     * <textarea id="textarea-id" required></textarea>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('textarea', textareaRequired);

    function textareaRequired() {
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs) {

            if (!attrs.required && (!attrs.ngRequired || attrs.ngRequired !== 'false')) return;

            attrs.$observe('id', function(id) {
                element.siblings('label[for="' + id + '"]').addClass('required');
            });
        }
    }

})();
