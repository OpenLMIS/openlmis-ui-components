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
     * @restrict A
     * @name openlmis-datetime:openlmisDatetimePicker
     *
     * @description
     * Directive adding datetime selection to the input.
     *
     * @example
     * Datetime picker directive can take max-date and min-date attributes. Their values can be set from other datetime
     * picker or manually.
     * ```
     * <input type="datetime"
     *     ng-model="startDate"
     *     id="datepicker-id"
     *     min-date="10/05/2016"
     *     max-date="endDate"/>
     * ```
     */
    angular
        .module('openlmis-datetime')
        .directive('input', openlmisDatetimePickerDirective);

    openlmisDatetimePickerDirective.$inject = ['messageService', 'localeService', 'moment'];

    function openlmisDatetimePickerDirective(messageService, localeService, moment) {
        return {
            restrict: 'E',
            compile: compile,
            scope: {
                minDate: '=?',
                maxDate: '=?'
            },
            require: 'ngModel'
        };

        function compile(element) {
            if (element.attr('type') === 'datetime') {
                element.attr('type', 'text');

                return link;
            }
        }

        function link(scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                showClear: true,
                showClose: true,
                keepInvalid: true,
                locale: messageService.getCurrentLocale(),
                timeZone: localeService.getFromStorage().timeZoneId,
                icons: {
                    time: 'fa fa-clock-o',
                    date: 'fa fa-calendar',
                    up: 'fa fa-arrow-up',
                    down: 'fa fa-arrow-down',
                    clear: 'fa fa-eraser',
                    close: 'fa fa-check'
                }
            });

            element.on('dp.change', function(event) {
                ngModelCtrl.$setViewValue(event.date);
            });

            var dateTimePicker = element.data('DateTimePicker');

            scope.$watch('minDate', function(newDate) {
                if (newDate) {
                    dateTimePicker.minDate(moment(newDate));
                }
            });

            scope.$watch('maxDate', function(newDate) {
                if (newDate) {
                    dateTimePicker.maxDate(moment(newDate));
                }
            });

            ngModelCtrl.$render = function() {
                if (ngModelCtrl.$viewValue && isNaN(ngModelCtrl.$viewValue)) {
                    dateTimePicker.defaultDate(moment(ngModelCtrl.$viewValue));
                }
                dateTimePicker.defaultDate(ngModelCtrl.$viewValue);
            };

            ngModelCtrl.$formatters.push(function(modelValue) {
                return modelValue ? moment(modelValue) : undefined;
            });

            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.toISOString();
            });

            ngModelCtrl.$validators.invalidDate = function(modelValue, viewValue) {
                return !viewValue || moment(viewValue).isValid();
            };
        }
    }

}());