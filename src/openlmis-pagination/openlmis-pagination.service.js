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
     * @name openlmis-pagination.paginationService
     *
     * @description
     * Allows registering the pagination elements.
     */
    angular
        .module('openlmis-pagination')
        .service('paginationService', service);

    service.$inject = ['$q', '$state', 'PAGE_SIZE', '$stateParams'];

    function service($q, $state, PAGE_SIZE, $stateParams) {

        this.registerUrl = registerUrl;
        this.registerList = registerList;
        this.getSize = getSize;
        this.getPage = getPage;
        this.getTotalItems = getTotalItems;
        this.getShowingItems = getShowingItems;
        this.isExternalPagination = isExternalPagination;

        var size,
            page,
            totalItems,
            showingItems,
            externalPagination,
            stateParams,
            stateName;

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name registerUrl
         *
         * @description
         * Registers all pagination params for API pagination.
         *
         * @param  {Object}   newStateParams  state params
         * @param  {Function} loadItemsMethod method that loads items
         * @return {Array}                    current page of items
         */
        function registerUrl(newStateParams, loadItemsMethod) {

            var deferred = $q.defer(),
                promise;

            if(!newStateParams.page) newStateParams.page = 0;
            if(!newStateParams.size) newStateParams.size = PAGE_SIZE;

            if(shouldChangePageToFirstOne(newStateParams)) {
                newStateParams.page = 0;
            }

            promise = loadItemsMethod(newStateParams);

            if(promise && promise.then) {
                promise.then(function(response) {
                    size = response.size;
                    page = response.number;
                    totalItems = response.totalElements;
                    showingItems = response.content.length;
                    externalPagination = true;
                    stateParams = newStateParams;
                    stateName = $state.current.name;

                    deferred.resolve(response.content);
                }, function() {
                    deferred.reject();
                });
            } else {
                size = 0;
                page = 0;
                totalItems = 0;
                showingItems = 0;
                externalPagination = true;
                stateParams = newStateParams;
                stateName = $state.current.name;
                deferred.resolve([]);
            }

            this.itemValidator = null;

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name registerList
         *
         * @description
         * Registers all pagination params for UI pagination.
         *
         * @param  {Object}   itemValidator   validator for items
         * @param  {Object}   newStateParams  state params
         * @param  {Function} loadItemsMethod method that loads items
         * @return {Array}                    current page of items
         */
        function registerList(itemValidator, newStateParams, loadItemsMethod) {

            var deferred = $q.defer(),
                pageItems,
                items;

            if(!newStateParams.page) newStateParams.page = 0;
            if(!newStateParams.size) newStateParams.size = PAGE_SIZE;

            items = loadItemsMethod();
            totalItems = items.length;
            externalPagination = false;
            this.itemValidator = itemValidator;
            stateName = $state.current.name;
            size = parseInt(newStateParams.size);
            page = parseInt(newStateParams.page);
            stateParams = newStateParams;

            deferred.resolve(items);

            return deferred.promise;
        }

        function shouldChangePageToFirstOne(newStateParams) {
            return $state.current.name === stateName &&
                !angular.equals(stateParams, newStateParams) &&
                newStateParams.page === stateParams.page;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name getSize
         *
         * @description
         * Returns maximum number of items on page.
         *
         * @return {Number} current page size
         */
        function getSize() {
            return size;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name getPage
         *
         * @description
         * Returns current page number.
         *
         * @return {Number} current page number
         */
        function getPage() {
            return page;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name getTotalItems
         *
         * @description
         * Returns number of all items.
         *
         * @return {Number} total items
         */
        function getTotalItems() {
            return totalItems;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name getShowingItems
         *
         * @description
         * Returns number of items that are showing on the screen.
         *
         * @return {Number} showing items number
         */
        function getShowingItems() {
            return showingItems;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name isExternalPagination
         *
         * @description
         * Indicates if current pagination is API or UI based.
         *
         * @return {Boolean} true if is API pagination, false otherwise
         */
        function isExternalPagination() {
            return externalPagination;
        }
    }

})();
