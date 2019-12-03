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
     * @name openlmis-pagination.component:openlmisPagination
     *
     * @description
     * The OpenLMIS-Pagination component provides controls for API endpoints
     * that can provide paginated content. This endpoint allows for methods to
     * add validation for sets of pages.
     * Pagination component have 2 optional attributes for UI pagination.
     * When you pass all items to list attribute, variable that is connected
     * to the paged-list attribute will be automatically filled
     * with page items after page changes.
     *
     * @example
     * ```
     * <openlmis-pagination
     *        list="allItems"
     *       paged-list="items">
     * <openlmis-pagination/>
     * ```
     */
    angular
        .module('openlmis-pagination')
        .component('openlmisPagination', {
            controller: 'PaginationController',
            controllerAs: 'pagination',
            templateUrl: 'openlmis-pagination/openlmis-pagination.html',
            bindings: {
                paginationId: '=?',
                list: '=?',
                pagedList: '=?',
                onPageChange: '=?'
            }
        });
})();