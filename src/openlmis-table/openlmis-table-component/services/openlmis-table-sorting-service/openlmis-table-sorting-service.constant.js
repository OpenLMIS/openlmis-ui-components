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
     * @ngdoc object
     * @name openlmis-table.SORTING_SERVICE_CONSTANTS
     *
     * @description
     * Contains constants used in sorting service.
     */
    angular
        .module('openlmis-table')
        .constant('SORTING_SERVICE_CONSTANTS', sortingServiceConstants());

    function sortingServiceConstants() {
        return {
            SORT_ASC_CLASS: 'sorted-ascending',
            SORT_DESC_CLASS: 'sorted-descending',
            ASC: 'asc',
            DESC: 'desc'
        };
    }
})();
