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
     * @ngdoc filter
     * @name openlmis-datetime.filter:openlmisDatetime
     *
     * @description
     * Parses the given datetime into more user-friendly string.
     *
     * @param   {String}  datetime  the datetime to be formatted
     * @return  {String}            the formated datetime
     *
     * @example
     * In the HTML:
     * ```
     * <td>{{datetime | openlmisDatetime}}</td>
     * ```
     * In the JS:
     * ```
     * $filter('datetime')(openlmisDatetime);
     * ```
     */
    angular
        .module('openlmis-datetime')
        .filter('openlmisDatetime', openlmisDatetimeFilter);

    openlmisDatetimeFilter.$inject = ['moment'];

    function openlmisDatetimeFilter(moment) {
        return function(datetime) {
            if (datetime) {
                return moment(datetime).format('L LT');
            }
        };
    }

})();
