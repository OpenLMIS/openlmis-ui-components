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

    dateUtils.$inject = ['$filter'];

    function dateUtils($filter) {
        var factory = {
            FILTER: 'date: \'dd/MM/yyyy\'',
            toDate: toDate,
            toArray: toArray,
            toStringDate: toStringDate
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
            if (!source) return undefined;
            if(!angular.isArray(source)) return fromISOString(source); // when date is ISO string, not array
            if (source.length === 3) return new Date(source[0], source[1] - 1, source[2]);
            if (source.length === 6)
                // array[1] - 1, because in JavaScript months starts with 0 (to 11)
                return new Date(source[0], source[1] - 1, source[2], source[3], source[4], source[5]);
            return undefined;
        }

        function fromISOString(isoDate) {
            var date = new Date(isoDate);
            if(isoDate.indexOf('Z') < 0) { // if date string does not contain time zone definition
                var offset = date.getTimezoneOffset() * 60000; // remove time zone offset
                date = new Date(date.getTime() + offset);
            }
            return date;
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
            if(includeTime) {
                array.push(date.getHours());
                array.push(date.getMinutes());
                array.push(date.getSeconds());
            }
            return array;
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
    }

})();
