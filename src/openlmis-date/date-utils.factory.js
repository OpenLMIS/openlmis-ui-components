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
     * @ngdoc service
     * @name openlmis-date.dateUtils
     *
     * @description
     * Responsible for retrieving dates.
     */
    angular
        .module('openlmis-date')
        .factory('dateUtils', dateUtils);

    dateUtils.$inject = ['$filter', 'localeService'];

    function dateUtils($filter, localeService) {
        var NUMBER_OF_SECONDS_IN_DAY = 86400000,
            factory = {
                toDate: toDate,
                toArray: toArray,
                toStringDate: toStringDate,
                toStringDateWithDefaultFormat: toStringDateWithDefaultFormat,
                addDaysToDate: addDaysToDate,
                convertEpochMilliToIsoDateString: convertEpochMilliToIsoDateString
            };
        return factory;

        /**
         * @ngdoc method
         * @methodOf openlmis-date.dateUtils
         * @name toDate
         *
         * @description
         * Transforms dates from array/string to Date object.
         *
         * @param  {Object} source string/array to be parsed
         * @return {Date}          parsed date
         */
        function toDate(source) {
            if (!source) {
                return undefined;
            }
            // when date is ISO string, not array
            if (!angular.isArray(source)) {
                return new Date(source);
            }

            if (source.length === 3) {
                return new Date(source[0], source[1] - 1, source[2]);
            }

            // array[1] - 1, because in JavaScript months starts with 0 (to 11)
            if (source.length === 6) {
                return new Date(source[0], source[1] - 1, source[2], source[3], source[4], source[5]);
            }
            return undefined;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-date.dateUtils
         * @name toArray
         *
         * @description
         * Transforms dates from Date to array.
         *
         * @param  {Date}    date        date to be parsed
         * @param  {Boolean} includeTime indicates if array should include time info
         * @return {Array}               parsed date array
         */
        function toArray(date, includeTime) {
            var array = [];
            array.push(date.getFullYear());
            array.push(date.getMonth() + 1);
            array.push(date.getDate());
            if (includeTime) {
                array.push(date.getHours());
                array.push(date.getMinutes());
                array.push(date.getSeconds());
            }
            return array;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-date.dateUtils
         * @name addDaysToDate
         *
         * @description
         * Adds days to given date.
         *
         * @param  {Date}    date         date to be changed
         * @param  {Boolean} numberOfDays number of days to be added
         * @return {Date}                 changed date
         */
        function addDaysToDate(date, numberOfDays) {
            return new Date(date.setTime(date.getTime() + NUMBER_OF_SECONDS_IN_DAY * numberOfDays));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-date.dateUtils
         * @name toStringDate
         *
         * @description
         * Transforms dates from Date to string.
         *
         * @param  {Date}  date date to be parsed
         * @return {Array}      parsed date array
         */
        function toStringDate(date) {
            return $filter('date')(date, 'yyyy-MM-dd');
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-date.dateUtils
         * @name toStringDate
         *
         * @description
         * Transforms dates from Date to string.
         *
         * @param  {Date}  date date to be parsed
         * @return {Array}      parsed date array
         */
        function toStringDateWithDefaultFormat(date) {
            return $filter('date')(date, localeService.getFromStorage().dateFormat);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-date.dateUtils
         * @name convertEpochMilliToIsoDateString
         *
         * @description
         * Convert epoch in milliseconds to ISO-8601 formatted date.
         *
         * @param  {Number} epochMilli epoch in milliseconds
         * @return {String}            ISO-8601 formatted date
         */
        function convertEpochMilliToIsoDateString(epochMilli) {
            return new Date(epochMilli)
                .toISOString();
        }
    }

})();
