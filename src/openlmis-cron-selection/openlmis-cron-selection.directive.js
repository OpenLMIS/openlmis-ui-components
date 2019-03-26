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

    openlmisCronSelectionDirective.$inject = ['CRON_REGEX', 'SIMPLE_CRON_REGEX', 'WEEKDAYS'];

    function openlmisCronSelectionDirective(CRON_REGEX, SIMPLE_CRON_REGEX, WEEKDAYS) {
        return {
            link: link,
            templateUrl: 'openlmis-cron-selection/openlmis-cron-selection.html',
            require: 'ngModel',
            scope: {},
            restrict: 'E'
        };

        function link(scope, _, __, ngModelCtrl) {
            scope.weekdays = WEEKDAYS;

            scope.validateHour = function() {
                return validateHour(scope.hour, scope.isComplex);
            };

            scope.validateMinute = function() {
                return validateMinute(scope.minute, scope.isComplex);
            };

            scope.validateCronExpression = function() {
                return validateCronExpression(scope.cronExpression, scope.isComplex);
            };

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
                var weekday = evaluateWeekday(
                    scope.occurrence,
                    convertWeekdayToNumber(scope.weekdays, scope.weekday),
                    evaluateDefaultForWeekly(oldVal, newVal)
                );

                ngModelCtrl.$setViewValue(buildViewValue(
                    scope.minute, scope.hour, weekday, scope.cronExpression, scope.isComplex
                ));
            }

            function modelToViewValue(modelValue) {
                var split = modelValue.split(' '),
                    minute = split[1],
                    hour = split[2],
                    weekday = split[5],
                    cronExpression = modelValue;

                return buildViewValue(minute, hour, weekday, cronExpression, isComplexCron(modelValue));
            }

            function viewToModelValue(viewValue) {
                if (viewValue.isComplex) {
                    return isValidCron(viewValue.cronExpression) ? viewValue.cronExpression : undefined;
                }
                if (isViewValueValid(viewValue)) {
                    return buildModelValue(viewValue.minute, viewValue.hour, viewValue.weekday);
                }
                return undefined;
            }

            function validateCronExpression(cronExpression, isComplex) {
                if (isComplex && !isValidCron(cronExpression)) {
                    return 'openlmisCronSelection.invalidCron';
                }
            }

            function isValidCron(cronExpression) {
                return CRON_REGEX.test(cronExpression);
            }

            function isComplexCron(value) {
                return !SIMPLE_CRON_REGEX.test(value);
            }

        }
    }

    function evaluateDefaultForWeekly(oldVal, newVal) {
        var SUNDAY = 0;
        if (newVal === 'Weekly' && oldVal === 'Daily') {
            return SUNDAY;
        }
    }

    function validateHour(hour, isComplex) {
        if (hour && !isComplex && !isBetween(hour, 0, 23)) {
            return 'openlmisCronSelection.hourOutOfRange';
        }
    }

    function validateMinute(minute, isComplex) {
        if (minute && !isComplex && !isBetween(minute, 0, 59)) {
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
        return !_.isUndefined(hour)
            && isBetween(hour, 0, 23);
    }

    function isMinuteValid(minute) {
        return !_.isUndefined(minute)
            && isBetween(minute, 0, 59);
    }

    function isBetween(number, start, end) {
        return number >= start
            && number <= end;
    }

    function buildModelValue(minute, hour, weekday) {
        return '0 ' + minute + ' ' + hour + ' * * ' + weekday;
    }

    function evaluateOccurrence(weekday) {
        var DAILY = '*';
        return weekday === DAILY ? 'Daily' : 'Weekly';
    }

    function evaluateWeekday(occurrence, weekday, defaultForWeekly) {
        var DAILY = '*';
        if (isDaily(occurrence)) {
            return DAILY;
        } else if (isWeekly(occurrence)) {
            return weekday === undefined ? defaultForWeekly : weekday;
        }
        return undefined;
    }

    function isDaily(occurrence) {
        return occurrence === 'Daily';
    }

    function isWeekly(occurrence) {
        return occurrence === 'Weekly';
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