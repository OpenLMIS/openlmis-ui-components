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
     * @name openlmis-form.directive:select-one-option
     *
     * @description
     * Automatically selects the value for a select element if there is only
     * one option available and the field is required.
     * 
     * Automatic selections only happen when the list of options change and
     * then the element is first rendered.
     *
     * @example
     * The following will be rendered like the commented out markup.
     * ```
     * <select ng-model="vm.value">
     *   <option>-- Select an option --</option>
     *   <option value="awesome">Awesome!</option>
     * </select>
     * <!--
     * <select ng-model="vm.value">
     *   <option>-- Select an option --</option>
     *   <option value="awesome" selected="selected">Awesome!</option>
     * </select>
     * -->
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('select', select);

    function select() {
        return {
            restrict: 'E',
            replace: false,
            require: ['select', '?ngModel'],
            priority: 9,
            link: link
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-form.directive:select-one-option
         * @name link
         *
         * @description
         * Sets up scope watchers and calls updateSelect when there is a change.
         */        
        function link(scope, element, attrs, ctrls) {
            var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1],
                optionsSelector = 'option:not(.placeholder)';

            updateSelect();

            // See if ng-repeat or ng-options changed
            scope.$watch(function() {
                var options = [];
                element.find(optionsSelector)
                    .each(function() {
                        options.push(this.value);
                    });
                return options.join(',');
            }, updateSelect);

            scope.$watch(function() {
                return attrs.hasOwnProperty('required');
            }, updateSelect);

            /**
             * @ngdoc method
             * @methodOf openlmis-form.directive:select-one-option
             * @name updateSelect
             *
             * @description
             * Checks if there is one option (that doesn't have the class 
             * "placeholder") and then sets the select element to that value.
             */
            function updateSelect() {
                if (!attrs.hasOwnProperty('required') || attrs.hasOwnProperty('noAutoSelect')) {
                    return ;
                }

                var options = element.children(optionsSelector);

                if (options.length === 1) {
                    var value = element.children(optionsSelector + ':first')
                        .val();
                    element.val(value);

                    if (ngModelCtrl) {
                        var selectedValue = selectCtrl.readValue();
                        ngModelCtrl.$setViewValue(selectedValue);
                    }
                }
            }
        }
    }
})();
