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
     * @name openlmis-form.directive:select-search-option
     *
     * @description
     * Disables select dropdown and displays modal with options and search input.
     * This functionality will be applied to select when there is
     * more than 10 options or it has pop-out attribute.
     *
     * @example
     * ```
     * <select .... pop-out ... > ..... </select>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('select', select);

    select.$inject = ['PAGE_SIZE', 'messageService'];

    function select(PAGE_SIZE, messageService) {
        return {
            restrict: 'E',
            require: ['select', '?ngModel'],
            priority: 10,
            link: link
        };

        function link(scope, element, attrs, ctrls) {
            var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1];

            updateSelect();

            function updateSelect() {
                element.select2({
                    minimumResultsForSearch: PAGE_SIZE,
                    allowClear: true,
                    placeholder: getPlaceholder(),
                    language: {
                        noResults: function(){
                            return messageService.get("openlmisForm.selectNoResults");
                        }
                    }
                });
            }


            function getPlaceholder() {
                var placeholderOption = element.children('.placeholder:first');

                if(placeholderOption.length == 0){
                    return false;
                } else {
                    return {
                        id: placeholderOption.val(),
                        text: placeholderOption.text()
                    };
                }
            }
        }
    }
})();
