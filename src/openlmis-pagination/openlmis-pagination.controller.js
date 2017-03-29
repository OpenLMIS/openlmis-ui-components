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

    controller.$inject = ['paginationService', '$state', '$stateParams', 'paginationFactory'];

    function controller(paginationService, $state, $stateParams, paginationFactory) {

        var pagination = this;

        pagination.$onInit = onInit;
        pagination.changePage = changePage;
        pagination.nextPage = nextPage;
        pagination.previousPage = previousPage;
        pagination.isCurrentPage = isCurrentPage;
        pagination.isFirstPage = isFirstPage;
        pagination.isLastPage = isLastPage;
        pagination.getPages = getPages;
        pagination.getTotalPages = getTotalPages;
        pagination.isPageValid = isPageValid;

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.controller:PaginationController
         * @name externalPagination
         * @type {Boolean}
         *
         * @description
         * Indicates if pagination logic is external.
         */
        pagination.externalPagination = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.controller:PaginationController
         * @name page
         * @type {Number}
         *
         * @description
         * Holds number of the current page.
         */
        pagination.page = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.controller:PaginationController
         * @name pageSize
         * @type {Number}
         *
         * @description
         * Holds maximum number of items that can be displayed.
         */
        pagination.pageSize = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.controller:PaginationController
         * @name totalItems
         * @type {Number}
         *
         * @description
         * Holds number of all items.
         */
        pagination.totalItems = undefined

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.controller:PaginationController
         * @name totalItems
         * @type {Number}
         *
         * @description
         * Holds number of items that are currently showing on screen.
         */
        pagination.showingItems = undefined;

        function onInit() {
            pagination.externalPagination = paginationService.isExternalPagination();
            if(pagination.externalPagination) {
                pagination.page = paginationService.getPage();
                pagination.pageSize = paginationService.getSize();
                pagination.totalItems = paginationService.getTotalItems();
                pagination.showingItems = paginationService.getShowingItems();
            } else {
                pagination.page = paginationService.getPage();
                pagination.pageSize = paginationService.getSize();
                pagination.totalItems = pagination.list.length;
                pagination.pagedList = paginationFactory.getPage(pagination.list, pagination.page, pagination.pageSize);
                pagination.showingItems = pagination.pagedList.length;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:PaginationController
         * @name changePage
         *
         * @description
         * Changes the current page number to a new one. If callback for changing page
         * was provided then it will be called.
         *
         * @param {Number} newPage New page number
         */
        function changePage(newPage) {
            if(newPage >= 0 && newPage < getTotalPages()) {

                if(!pagination.externalPagination) {
                    pagination.pagedList = paginationFactory.getPage(pagination.list, newPage, pagination.pageSize);
                }

                var stateParams = angular.copy($stateParams);

                pagination.page = newPage;
                stateParams.page = newPage;

                $state.go($state.current.name, stateParams, {
                    reload: pagination.externalPagination,
                    notify: pagination.externalPagination
                });
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:PaginationController
         * @name nextPage
         *
         * @description
         * Changes the current page to next one.
         */
        function nextPage() {
            changePage(pagination.page + 1);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:PaginationController
         * @name previousPage
         *
         * @description
         * Changes the current page number to a previous one.
         */
        function previousPage() {
            changePage(pagination.page - 1);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:PaginationController
         * @name isCurrentPage
         *
         * @description
         * Checks if the page number is current one.
         *
         * @param {Number} newPage number of page to check
         */
        function isCurrentPage(pageNumber) {
            return pagination.page === pageNumber;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:PaginationController
         * @name isFirstPage
         *
         * @description
         * Checks if current page is first one on the list.
         */
        function isFirstPage() {
            return pagination.page === 0;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:PaginationController
         * @name isLastPage
         *
         * @description
         * Checks if current page is last one on the list.
         */
        function isLastPage() {
            return pagination.page === getTotalPages() - 1;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:PaginationController
         * @name getPages
         *
         * @description
         * Generates array with numbers of all pages.
         *
         * @return {Array} generated numbers for pagination
         */
        function getPages() {
            return new Array(Math.max(getTotalPages(), 1));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:PaginationController
         * @name getTotalPages
         *
         * @description
         * Return number of pages in total.
         *
         * @return {Number} number of pages
         */
        function getTotalPages() {
            return Math.ceil(pagination.totalItems / pagination.pageSize);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:PaginationController
         * @name isPageValid
         *
         * @description
         * Checks if all items on page are valid
         *
         * @return {Boolean} true if page is valid, false otherwise
         */
        function isPageValid(pageNumber) {

            if(!paginationService.itemValidator) return true;

            var valid = true;
            angular.forEach(paginationFactory.getPage(pagination.list, pageNumber, pagination.pageSize), function(item) {
                valid = valid && paginationService.itemValidator(item);
            });

            return valid;
        }
    }
})();
