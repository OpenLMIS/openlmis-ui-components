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
     * @ngdoc controller
     * @name openlmis-pagination.controller:PaginationController
     *
     * @description
     * Responsible for managing pagination element.
     */
    angular
        .module('openlmis-pagination')
        .controller('PaginationController', controller);

    function controller() {
        var vm = this;

        vm.changePage = changePage;
        vm.nextPage = nextPage;
        vm.previousPage = previousPage;

        vm.isCurrentPage = isCurrentPage;
        vm.isFirstPage = isFirstPage;
        vm.isLastPage = isLastPage;

        vm.getPages = getPages;
        vm.getTotalPages = getTotalPages;

        /**
         * @ngdoc method
         * @name changePage
         * @methodOf openlmis-pagination.controller:PaginationController
         *
         * @description
         * Changes the current page number to a new one. If callback for changing page
         * was provided then it will be called.
         *
         * @param  {integer} newPage New page number
         */
        function changePage(newPage) {
            if(newPage >= 0 && newPage < getTotalPages()) {
                vm.page = newPage;
            }
        }

        /**
         * @ngdoc method
         * @name nextPage
         * @methodOf openlmis-pagination.controller:PaginationController
         *
         * @description
         * Changes the current page to next one.
         */
        function nextPage() {
            changePage(vm.page + 1);
        }

        /**
         * @ngdoc method
         * @name previousPage
         * @methodOf openlmis-pagination.controller:PaginationController
         *
         * @description
         * Changes the current page number to a previous one.
         */
        function previousPage() {
            changePage(vm.page - 1);
        }

        /**
         * @ngdoc method
         * @name isCurrentPage
         * @methodOf openlmis-pagination.controller:PaginationController
         *
         * @description
         * Checks if the page number is current one.
         *
         * @param {integer} newPage number of page to check
         */
        function isCurrentPage(pageNumber) {
            return vm.page === pageNumber;
        }

        /**
         * @ngdoc method
         * @name isFirstPage
         * @methodOf openlmis-pagination.controller:PaginationController
         *
         * @description
         * Checks if current page is first one on the list.
         */
        function isFirstPage() {
            return vm.page === 0;
        }

        /**
         * @ngdoc method
         * @name isLastPage
         * @methodOf openlmis-pagination.controller:PaginationController
         *
         * @description
         * Checks if current page is last one on the list.
         */
        function isLastPage() {
            return vm.page === getTotalPages() - 1;
        }

        /**
         * @ngdoc method
         * @name getPages
         * @methodOf openlmis-pagination.controller:PaginationController
         *
         * @description
         * Generates array with numbers of all pages.
         *
         * @return {Array} generated numbers for pagination
         */
        function getPages() {
            return new Array(getTotalPages());
        }

        function getTotalPages() {
            return Math.ceil(vm.totalItems / vm.pageSize);
        }
    }

})();
