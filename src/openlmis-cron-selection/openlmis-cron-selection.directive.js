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
     * @name openlmis-cron-selection.openlmisCronSelection
     * @restrict E
     *
     * @description
     * Directive providing a method for building cron expressions. If a cron that is not in form of "daily at .." or
     * "weekly on .. at .." an input will be shown allowing the user to edit the cron expression.
     * 
     * @example 
     * To add the tag selection component simply include the following code in your HTML file:
     * ```
     * <openlmis-cron-selection ng-model="modelVar"></openlmis-cron-selection>
     * ```
     */
    angular
        .module('openlmis-cron-selection')
        .directive('openlmisCronSelection', openlmisCronSelectionDirective);

    openlmisCronSelectionDirective.$inject = ['CRON_REGEX', 'SIMPLE_CRON_REGEX', 'WEEKDAYS', 'OCCURRENCES'];

    function openlmisCronSelectionDirective(CRON_REGEX, SIMPLE_CRON_REGEX, WEEKDAYS, OCCURRENCES) {
        return {
            link: link,
            templateUrl: 'openlmis-cron-selection/openlmis-cron-selection.html',
            require: 'ngModel',
            scope: {
                ngRequired: '=',
                ngDisabled: '='
            },
            restrict: 'E'
        };

        function link(scope, _, __, ngModelCtrl) {
            scope.weekdays = WEEKDAYS;
            scope.occurrences = OCCURRENCES;

            scope.validateHour = validateHour;
            scope.validateMinute = validateMinute;
            scope.validateCronExpression = validateCronExpression;
            scope.isWeekly = isWeekly;
            scope.isDaily = isDaily;

            ngModelCtrl.$formatters.push(modelToViewValue);
            ngModelCtrl.$parsers.push(viewToModelValue);
            ngModelCtrl.$render = function() {
                scope.occurrence = evaluateOccurrence(ngModelCtrl.$viewValue.weekday);
                scope.weekday = scope.weekdays[ngModelCtrl.$viewValue.weekday];
                scope.hour = ngModelCtrl.$viewValue.hour;
                scope.minute = ngModelCtrl.$viewValue.minute;
                scope.cronExpression = ngModelCtrl.$viewValue.cronExpression;
                scope.isComplex = ngModelCtrl.$viewValue.isComplex;
            };

            scope.$watch('cronExpression', handleScopeChange);
            scope.$watch('occurrence', handleScopeChange);
            scope.$watch('weekday', handleScopeChange);
            scope.$watch('minute', handleScopeChange);
            scope.$watch('hour', handleScopeChange);

            function handleScopeChange(newVal, oldVal) {
                var weekday = evaluateWeekday(scope.occurrence, convertWeekdayToNumber(scope.weekdays, scope.weekday),
                    evaluateDefaultForWeekly(oldVal, newVal));

                ngModelCtrl.$setViewValue(buildViewValue(
                    scope.minute, scope.hour, weekday, scope.cronExpression, scope.isComplex
                ));
            }

            function modelToViewValue(modelValue) {
                if (modelValue) {
                    var split = modelValue.split(' '),
                        minute = split[1],
                        hour = split[2],
                        weekday = split[5],
                        cronExpression = modelValue;
                }
                var isComplex = modelValue ? isComplexCron(modelValue) : false;

                return buildViewValue(minute, hour, weekday, cronExpression, isComplex);
            }

            function viewToModelValue(viewValue) {
                if (viewValue.isComplex) {
                    return isValidCron(viewValue.cronExpression) ? viewValue.cronExpression : '';
                }
                if (isViewValueValid(viewValue)) {
                    return buildModelValue(viewValue.minute, viewValue.hour, viewValue.weekday);
                }
                return '';
            }

            function validateCronExpression(cronExpression, isComplex, ngDisabled) {
                return !ngDisabled && isComplex && !isValidCron(cronExpression) ?
                    'openlmisCronSelection.invalidCron' : undefined;
            }

            function isValidCron(cronExpression) {
                return !cronExpression || CRON_REGEX.test(cronExpression);
            }

            function isComplexCron(value) {
                return !SIMPLE_CRON_REGEX.test(value);
            }

            function evaluateDefaultForWeekly(oldVal, newVal) {
                var SUNDAY = 0;
                if (isWeekly(newVal, OCCURRENCES) && isDaily(oldVal, OCCURRENCES)) {
                    return SUNDAY;
                }
            }

            function evaluateOccurrence(weekday) {
                if (weekday) {
                    var DAILY = '*';
                    return weekday === DAILY ? OCCURRENCES.DAILY : OCCURRENCES.WEEKLY;
                }
            }

            function evaluateWeekday(occurrence, weekday, defaultForWeekly) {
                var DAILY = '*';
                if (isDaily(occurrence, OCCURRENCES)) {
                    return DAILY;
                } else if (isWeekly(occurrence, OCCURRENCES)) {
                    return weekday === undefined ? defaultForWeekly : weekday;
                }
                return undefined;
            }
        }
    }

    function isDaily(occurrence, OCCURRENCES) {
        return occurrence === OCCURRENCES.DAILY;
    }

    function isWeekly(occurrence, OCCURRENCES) {
        return occurrence === OCCURRENCES.WEEKLY;
    }

    function validateHour(hour, isComplex, ngDisabled) {
        if (!ngDisabled && hour && !isComplex && !isBetween(hour, 0, 23)) {
            return 'openlmisCronSelection.hourOutOfRange';
        }
    }

    function validateMinute(minute, isComplex, ngDisabled) {
        if (!ngDisabled && minute && !isComplex && !isBetween(minute, 0, 59)) {
            return 'openlmisCronSelection.minuteOutOfRange';
        }
    }

    function isViewValueValid(viewValue) {
        return isWeekdayValid(viewValue.weekday)
            && isHourValid(viewValue.hour)
            && isMinuteValid(viewValue.minute);
    }

    function isWeekdayValid(weekday) {
        return !_.isUndefined(weekday);
    }

    function isHourValid(hour) {
        return (hour || hour === 0)
            && isBetween(hour, 0, 23);
    }

    function isMinuteValid(minute) {
        return (minute || minute === 0)
            && isBetween(minute, 0, 59);
    }

    function isBetween(number, start, end) {
        return number >= start
            && number <= end;
    }

    function buildModelValue(minute, hour, weekday) {
        return '0 ' + minute + ' ' + hour + ' * * ' + weekday;
    }

    function convertWeekdayToNumber(weekdays, weekday) {
        var index = weekdays.indexOf(weekday);

        return index > -1 ? index : undefined;
    }

    function buildViewValue(minute, hour, weekday, cronExpression, isComplex) {
        return {
            minute: minute,
            hour: hour,
            weekday: weekday,
            cronExpression: cronExpression,
            isComplex: isComplex
        };
    }

}());