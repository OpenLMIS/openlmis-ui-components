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
     * @name openlmis-form.directive:openlmisDatepicker
     *
     * @description
     * Directive allows to add date picker input.
     *
     * @example
     * To make this directive work only 'value' attribute is required, however there are more attributes to use.
     * In order to make datepicker input use id you can add 'input-id' attribute.
     * The 'change-method' attribute takes function that will be executed after datepicker value change.
     * Datepicker directive also can take max-date and min-date attributes. Their values can be set from other datepickers or manually.
     * ```
     * <openlmis-datepicker
     * 	   value="startDate"
     *     input-id="datepicker-id"
     *     change-method="afterChange()"
     *     min-date="10/05/2016"
     *     max-date="endDate"
     *     disabled="endDate === null">
     * </openlmis-datepicker>
     *
     * <openlmis-datepicker
     * 	   value="endDate">
     * </openlmis-datepicker>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('openlmisDatepicker', datepicker);

    datepicker.$inject = [
        '$filter', 'jQuery', 'messageService', 'DEFAULT_DATEPICKER_FORMAT', 'dateUtils', 'DateFormatTranslator',
        'moment'
    ];

    function datepicker($filter, jQuery, messageService, DEFAULT_DATEPICKER_FORMAT, dateUtils,
                        DateFormatTranslator, moment) {
        return {
            restrict: 'E',
            scope: {
                value: '=',
                inputId: '@?',
                minDate: '=?',
                maxDate: '=?',
                changeMethod: '=?',
                dateFormat: '=?',
                language: '=?',
                required: '=?',
                invalidMessage: '=?',
                disabled: '&?'
            },
            templateUrl: 'openlmis-form/openlmis-datepicker.html',
            link: link
        };

        function link(scope, element, attrs, modelCtrl) {
            var dateFormatTranslator = new DateFormatTranslator(),
                input = element.find('input'),
                momentDateFormat = dateFormatTranslator.translateBootstrapToMoment(getDateFormat(scope)),
                datepicker;

            setInitialValue();
            configureDatepicker();
            setupDateFormatValidator();

            scope.$watch('dateString', updateValue);
            scope.$watch('value', updateDateString);
            scope.$watch('disabled', updateDisabledAttr);

            element.on('$destroy', cleanUp);
            scope.$on('$destroy', cleanUp);

            watchDate('minDate', 'setStartDate', -Infinity);
            watchDate('maxDate', 'setEndDate', Infinity);

            function setInitialValue() {
                if (scope.value) {
                    // Populate initial value, if passed to directive
                    scope.value = $filter('isoDate')(scope.value);
                    updateDateString();
                }
            }

            function configureDatepicker() {
                var language = messageService.getCurrentLocale();

                configureDatepickerLabels(language);

                datepicker = input.datepicker({
                    format: scope.dateFormat || DEFAULT_DATEPICKER_FORMAT,
                    language: language,
                    clearBtn: true,
                    todayHighlight: true,
                    autoclose: true,
                    forceParse: false
                });
            }

            function dateFormatValidator(value) {
                return !value || moment(value, momentDateFormat, true).isValid();
            }

            function setupDateFormatValidator() {
                input.controller('ngModel').$validators.invalidDate = dateFormatValidator;
            }

            function updateValue(value) {
                var momentDate = moment(value, momentDateFormat, true);

                scope.value = momentDate.isValid() ? $filter('isoDate')(momentDate.toDate()) : undefined;

                if (scope.changeMethod && scope.changeMethod instanceof Function) {
                    scope.changeMethod();
                }
            }

            function updateDateString() {
                scope.dateString = getFilteredDate(scope.value);
            }

            function updateDisabledAttr() {
                if (isDisabled(scope.disabled)) {
                    datepicker.attr('disabled', 'disabled');
                } else {
                    datepicker.removeAttr('disabled');
                }
            }

            function watchDate(dateName, fnName, defaultValue) {
                scope.$watch(dateName, function(newDate) {
                    input.datepicker(fnName, getFilteredDate(newDate) || defaultValue);
                });
            }

            function cleanUp() {
                input.datepicker('destroy');
                datepicker = undefined;
                input = undefined;
            }
        }

        function getDateFormat(scope) {
            return scope.dateFormat || DEFAULT_DATEPICKER_FORMAT;
        }

        function isDisabled(disabled) {
            return (disabled instanceof Function && disabled()) || disabled === 'true';
        }

        function configureDatepickerLabels(language) {
            var datepickerSettings = jQuery.fn.datepicker.dates;
            if (!datepickerSettings[language]) {
                // We explicitly pass titleFormat, because datepicker doesn't apply it automatically
                // for each language, while this property is required.
                var localization = getDatepickerLabels();
                localization.titleFormat = "MM yyyy";

                datepickerSettings[language] = localization;
            }
        }

        function getDatepickerLabels() {
            var labels = {
                months: [],
                monthsShort: [],
                days: [],
                daysShort: [],
                daysMin: [],
                today: messageService.get('openlmisForm.datepicker.today'),
                clear: messageService.get('openlmisForm.datepicker.clear')
            };

            for (var i = 1; i <= 12; i++) {
                var longKey = 'openlmisForm.datepicker.monthNames.long.' + i;
                labels.months.push(messageService.get(longKey));

                var shortKey = 'openlmisForm.datepicker.monthNames.short.' + i;
                labels.monthsShort.push(messageService.get(shortKey));
            }

            for (var i = 1; i <= 7; i++) {
                var longKey = 'openlmisForm.datepicker.dayNames.long.' + i;
                labels.days.push(messageService.get(longKey));

                var shortKey = 'openlmisForm.datepicker.dayNames.short.' + i;
                labels.daysShort.push(messageService.get(shortKey));

                var minKey = 'openlmisForm.datepicker.dayNames.min.' + i;
                labels.daysMin.push(messageService.get(minKey));
            }

            return labels;
        }

        function getFilteredDate(date) {
            if (!date) {
                return undefined;
            }

            var dateWithoutTimeZone;
            if (date instanceof Date) {
                dateWithoutTimeZone = dateUtils.toDate(date.toISOString());
            } else {
                dateWithoutTimeZone = dateUtils.toDate(date);
            }
            return $filter('openlmisDate')(dateWithoutTimeZone);
        }
    }
})();
