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
     * @name openlmis-date.filter:period
     *
     * @description
     * Parses the given period into more readable form. Depending on whether the includeName flag
     * is set it will parse the period into "PeriodName (1/1/17 - 1/31/17)" or just
     * "1/1/17 - 1/31/17".
     *
     * @param   {Object}  period      the period to be formated
     * @param   {Boolean} includeName the flag defining whether name of period should be included
     * @return  {String}              the formated period
     *
     * @example
     * We want to display a period inside of a table and we want to include the period name
     * ```
     * <td>{{somePeriod | period:true}}</td>
     * ```
     */
    angular
        .module('openlmis-date')
        .filter('period', periodFilter);

    periodFilter.$inject = ['$filter', 'localeService'];

    function periodFilter($filter, localeService) {
        return function(period, includeName) {
            var dateFormat = localeService.getFromStorage().dateFormat;
            var startDate = $filter('date')(period.startDate, dateFormat),
                endDate = $filter('date')(period.endDate, dateFormat),
                transformed = startDate + ' - ' + endDate;

            return includeName ? period.name + ' (' + transformed + ')' : transformed;
        };
    }

})();
