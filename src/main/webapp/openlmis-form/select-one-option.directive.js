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
     * @name openlmis-form.directive:select-one-option
     * @restrict E
     *
     * @description
     * Disables an select element if there is only one option, and selects that options.
     *
     * @example
     * The following will be rendered like the commented out markup.
     * ```
     * <select ng-model="vm.value">
     *   <option>-- Select an option --</option>
     *   <option value="awesome">Awesome!</option>
     * </select>
     * <!--
     * <select ng-model="vm.value" disabled>
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
            link: link
        };

        function link(scope, element, attrs, ctrls) {
            var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1],
                optionsSelector = 'option:not(.placeholder)';

            updateSelect();
            if(ngModelCtrl) {
                // using instead of $ngModelCtrl.$render
                // beacuse ngSelect uses it
                scope.$watch(function() {
                    return ngModelCtrl.$modelValue;
                }, updateSelect);

                // See if ng-repeat or ng-options changed
                scope.$watch(function() {
                    return element.html();
                }, updateSelect);
            }

            function updateSelect() {
                var options = element.children(optionsSelector);

                if(options.length <= 1) {
                    element.attr('disabled', true);
                } else {
                    element.attr('disabled', false);
                }

                if(options.length == 1) {
                    element.children('option[selected="selected"]').removeAttr('selected');
                    element.children(optionsSelector + ':first').attr('selected', 'selected');

                    if(ngModelCtrl) {
                        var selectedValue = selectCtrl.readValue();
                        ngModelCtrl.$setViewValue(selectedValue);
                    }
                }
            }
        }
    }
})();
