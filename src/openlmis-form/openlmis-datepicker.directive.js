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
        '$filter', 'jQuery', 'messageService', 'DEFAULT_DATEPICKER_FORMAT', 'dateUtils', 'DatepickerFormatTranslator'
    ];

    function datepicker($filter, jQuery, messageService, DEFAULT_DATEPICKER_FORMAT, dateUtils,
                        DatepickerFormatTranslator) {
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
            setupFormatting(scope);

            if (scope.value) {
                // Populate initial value, if passed to directive
                scope.value = $filter('isoDate')(scope.value);
                scope.dateString = getFilteredDate(scope.value);
            }

            var datepicker = element.find('input').datepicker({
                format: scope.dateFormat
            });

            datepicker.on('changeDate', function(event) {
                var date = element.find('input').datepicker('getDate');

                scope.value = date ? $filter('isoDate')(date) : undefined;

                if (scope.changeMethod && scope.changeMethod instanceof Function) {
                    scope.changeMethod();
                }
            });

            scope.$watch('value', function() {
                scope.invalidMessage = undefined;
                if (scope.value) {
                    var dateString = getFilteredDate(scope.value);
                    if (dateString !== scope.dateString) {
                        scope.dateString = dateString;
                    }
                } else {
                    scope.dateString = undefined;
                }
            });

            scope.$watch('disabled', function() {
                if ((scope.disabled instanceof Function && scope.disabled()) || scope.disabled === 'true') {
                    datepicker.attr('disabled', 'disabled');
                } else {
                    datepicker.removeAttr('disabled');
                }
            });

            element.on('$destroy', cleanUp);
            scope.$on('destroy', cleanUp);

            var input = element.find('input');

            watchDate('minDate', 'setStartDate', -Infinity);
            watchDate('maxDate', 'setEndDate', Infinity);

            function watchDate(dateName, fnName, defaultValue) {
                scope.$watch(dateName, function(newDate) {
                    var formattedDate;

                    if (newDate) {
                        formattedDate = $filter('date')(
                            new Date(newDate),
                            new DatepickerFormatTranslator().translate(scope.dateFormat)
                        );
                    }

                    input.datepicker(fnName, formattedDate || defaultValue);
                });
            }

            function cleanUp() {
                input = undefined;
            }
        }

        function setupFormatting(scope) {
            scope.language = messageService.getCurrentLocale();
            scope.dateFormat = angular.isDefined(scope.dateFormat) ? scope.dateFormat : DEFAULT_DATEPICKER_FORMAT;

            var datepickerSettings = jQuery.fn.datepicker.dates;
            if (!datepickerSettings[scope.language]) {
                // We explicitly pass titleFormat, because datepicker doesn't apply it automatically
                // for each language, while this property is required.
                var localization = getDatepickerLabels();
                localization.titleFormat = "MM yyyy";

                datepickerSettings[scope.language] = localization;
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
