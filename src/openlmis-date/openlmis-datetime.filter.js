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
     * @name openlmis-date.filter:openlmisDatetime
     *
     * @description
     * Returns date and time in given format. If no format provided, returns
     * date and time in default format defined in config file.
     *
     * @param  {String} datetime        datetime to be formatted
     * @param  {String} dateTimeFormat  (optional) format of the datetime
     * @return {String}                 formatted datetime
     */
    angular
        .module('openlmis-date')
        .filter('openlmisDatetime', openlmisDatetimeFilter);

    openlmisDatetimeFilter.$inject = ['$filter', 'DEFAULT_DATETIME_FORMAT'];

    function openlmisDatetimeFilter($filter, DEFAULT_DATETIME_FORMAT) {
        return function(datetime, datetimeFormat) {
            return $filter('date')(datetime, datetimeFormat ? datetimeFormat : DEFAULT_DATETIME_FORMAT);
        }
    }

})();
