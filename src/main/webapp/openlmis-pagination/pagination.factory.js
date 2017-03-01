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
     * @name openlmis-pagination.paginationFactory
     *
     * @description
     * Provides method for dividing lists into pages.
     */
    angular
        .module('openlmis-pagination')
        .factory('paginationFactory', factory);

    factory.$inject = [];

    function factory() {
        var factory = {
            getPage: getPage
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationFactory
         * @name getPage
         *
         * @description
         * Gets the page with the given number of the given size.
         *
         * @param  {Array}  items the list of items to get the page from
         * @param  {Number} page  the number of the page
         * @param  {Number} size  the size of the page
         * @return {Array}        the size-long sublist of the given list
         */
        function getPage(items, page, size) {
            var start = page * size,
                end = Math.min(items.length, start + size);

            return start < end ? items.slice(start, end) : [];
        }
    }

})();
