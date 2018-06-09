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
     * @name openlmis-facility.filter:facility
     *
     * @description
     * Parses the given facility into "FacilityCode - FacilityName"
     *
     * @param   {Object}  facility  the facility to be formated
     * @return  {String}            the formatted facility
     *
     * @example
     * We want to display a facility inside of a table and we want to include the facility code
     * ```
     * <td>{{someFacility | facility}}</td>
     * ```
     */
    angular
        .module('openlmis-facility')
        .filter('facility', facilityFilter);

    function facilityFilter() {
        return function(facility) {
            return facility.code + ' - ' + facility.name;
        };
    }

})();