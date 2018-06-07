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
     * @name openlmis-form.directive:openlmisDatepicker
     *
     * @description
     * Directive allows to add date picker input.
     *
     * @example
     * Datepicker directive can take max-date and min-date attributes. Their values can be set from other datepickers or
     * manually.
     * ```
     * <input type="text" openlmis-datepicker
     * 	   ng-model="startDate"
     *     id="datepicker-id"
     *     ng-change="afterChange()"
     *     min-date="10/05/2016"
     *     max-date="endDate"
     *     disabled="endDate === null"/>
     *
     * <input type="text" openlmis-datepicker
     * 	   ng-model="endDate"/>
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
            restrict: 'A',
            link: link,
            scope: {
                minDate: '=?',
                maxDate: '=?',
                dateFormat: '=?',
                language: '=?'
            },
            require: 'ngModel'
        };

        function link(scope, element, attrs, ngModelCtrl) {
            var momentDateFormat = new DateFormatTranslator().translateBootstrapToMoment(getDateFormat(scope)),
                ISO_FORMAT = 'YYYY-MM-DD';

            configureDatepicker();

            ngModelCtrl.$formatters.push(function(modelValue) {
                return getFilteredDate(modelValue);
            });

            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue ? moment(viewValue, momentDateFormat, true).format(ISO_FORMAT) : viewValue;
            });

            ngModelCtrl.$validators.invalidDate = function (value) {
                return !value || moment(value, ISO_FORMAT, true).isValid();
            };

            element.on('$destroy', cleanUp);
            scope.$on('$destroy', cleanUp);

            watchDate('minDate', 'setStartDate', -Infinity);
            watchDate('maxDate', 'setEndDate', Infinity);

            function configureDatepicker() {
                var language = messageService.getCurrentLocale();

                configureDatepickerLabels(language);

                element.parent().addClass('openlmis-datepicker');
                element.datepicker({
                    format: scope.dateFormat || DEFAULT_DATEPICKER_FORMAT,
                    language: language,
                    clearBtn: true,
                    todayHighlight: true,
                    autoclose: true,
                    forceParse: false
                });
            }

            function watchDate(dateName, fnName, defaultValue) {
                scope.$watch(dateName, function(newDate) {
                    element.datepicker(fnName, getFilteredDate(newDate) || defaultValue);
                });
            }

            function cleanUp() {
                if (element) {
                    element.datepicker('destroy');
                }
            }

            function getDateFormat(scope) {
                return scope.dateFormat || DEFAULT_DATEPICKER_FORMAT;
            }
        }

        function configureDatepickerLabels(language) {
            var datepickerSettings = jQuery.fn.datepicker.dates;
            if (!datepickerSettings[language]) {
                // We explicitly pass titleFormat, because datepicker doesn't apply it automatically
                // for each language, while this property is required.
                var localization = getDatepickerLabels();
                localization.titleFormat = 'MM yyyy';

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

            var longKey, shortKey, i;
            for (i = 1; i <= 12; i++) {
                longKey = 'openlmisForm.datepicker.monthNames.long.' + i;
                labels.months.push(messageService.get(longKey));

                shortKey = 'openlmisForm.datepicker.monthNames.short.' + i;
                labels.monthsShort.push(messageService.get(shortKey));
            }

            for (i = 1; i <= 7; i++) {
                longKey = 'openlmisForm.datepicker.dayNames.long.' + i;
                labels.days.push(messageService.get(longKey));

                shortKey = 'openlmisForm.datepicker.dayNames.short.' + i;
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
