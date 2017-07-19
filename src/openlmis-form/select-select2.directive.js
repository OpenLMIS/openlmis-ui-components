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
     * Loads select2 on to all select elements. This directive takes its state
     * from the element it's instantiated on.
     *
     * The search field for select2 is loaded if the number of options is
     * greater than PAGE_SIZE.
     */
    angular
        .module('openlmis-form')
        .directive('select', select);

    select.$inject = ['PAGE_SIZE', 'messageService'];

    function select(PAGE_SIZE, messageService) {
        return {
            restrict: 'E',
            priority: 10,
            link: link
        };

        function link(scope, element, attrs) {

            createSelect();

            scope.$watch(function(){
                return element.val();
            }, updateSelect);

            scope.$watch(function(){
                return element.find(':selected').val();
            }, updateSelect);

            scope.$watch(function(){
                var placeholderValues = [];
                element.find('.placeholder').each(function(){
                    placeholderValues.push(this.value);
                });
                return placeholderValues.join(' - ');
            }, updateSelect);

            scope.$on('$destroy', destroySelect);


            /**
             * @ngdoc method
             * @methodOf openlmis-form.directive:select-search-option
             * @name createSelect
             *
             * @description
             * Creates the select2 element
             */
            function createSelect() {
                var options = {
                    minimumResultsForSearch: PAGE_SIZE,
                    allowClear: true,
                    dropdownAutoWidth: true,
                    selectOnClose: true,
                    placeholder: getPlaceholder(),
                    language: {
                        noResults: function(){
                            return messageService.get("openlmisForm.selectNoResults");
                        }
                    }
                };

                var modalParent = element.parents('.modal');
                if(modalParent.length > 0){
                    options['dropdownParent'] = modalParent;
                }

                element.select2(options);
            }

            function destroySelect() {
                if(element.data('select2')){
                    element.select2("destroy");
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-form.directive:select-search-option
             * @name updateSelect
             *
             * @description
             * Triggers select2's "undocumented" change event
             */
            function updateSelect(){
                element.trigger('change.select2');
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-form.directive:select-search-option
             * @name getPlaceholder
             *
             * @description
             * Gets the placeholder text from the first item in the placeholder list
             */
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
