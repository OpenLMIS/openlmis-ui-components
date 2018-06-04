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
        .run(run)
        .service('paginationService', service);

    run.$inject = ['paginationService'];

    function run(paginationService) {
        paginationService.init();
    }

    service.$inject = ['$q', '$state', 'PAGE_SIZE', '$rootScope'];

    function service($q, $state, PAGE_SIZE, $rootScope) {

        var stateName, stateParams, paginationParamsMap = {};

        this.init = init;
        this.registerUrl = registerUrl;
        this.registerList = registerList;
        this.getSize = getSize;
        this.getPage = getPage;
        this.getTotalItems = getTotalItems;
        this.getShowingItems = getShowingItems;
        this.isExternalPagination = isExternalPagination;

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name init
         *
         * @description
         * Initiates the pagination service and fires up a listener for state changes.
         */
        function init() {
            $rootScope.$on('$stateChangeStart', function(event, toState) {
                clearPaginationParamsMap(toState.name);
                stateName = toState.name;
            });
        }

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

            if (!newStateParams.page) newStateParams.page = 0;
            if (!newStateParams.size) newStateParams.size = PAGE_SIZE;

            if (shouldChangePageToFirstOne(newStateParams)) {
                newStateParams.page = 0;
            }

            promise = loadItemsMethod(newStateParams);

            if (promise && promise.then) {
                promise.then(function(response) {
                    paginationParamsMap[stateName] = {
                        size: response.size,
                        page: response.number,
                        totalItems: response.totalElements,
                        showingItems: response.content.length,
                        externalPagination: true
                    };

                    deferred.resolve(response.content);
                }, function() {
                    deferred.reject();
                });
            } else {
                paginationParamsMap[stateName] = {
                    size: 0,
                    page: 0,
                    totalItems: 0,
                    showingItems: 0,
                    externalPagination: true
                };


                deferred.resolve([]);
            }

            stateParams = newStateParams;

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
                items;

            if (!newStateParams.page) newStateParams.page = 0;
            if (!newStateParams.size) newStateParams.size = PAGE_SIZE;

            items = loadItemsMethod();

            paginationParamsMap[stateName] = {
                size: parseInt(newStateParams.size),
                page: parseInt(newStateParams.page),
                totalItems: items.length,
                externalPagination: false
            };

            this.itemValidator = itemValidator;
            stateName = $state.current.name;
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
            return getPaginationParam('size');
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
            return getPaginationParam('page');
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
            return getPaginationParam('totalItems');
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
            return getPaginationParam('showingItems');
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
            return getPaginationParam('externalPagination');
        }

        function getPaginationParam(name) {
            if (paginationParamsMap[$state.current.name]) {
                return paginationParamsMap[$state.current.name][name];
            }
        }

        function clearPaginationParamsMap(toState) {
            Object.keys(paginationParamsMap).forEach(function(state) {
                if (toState.indexOf(state) === -1) {
                    delete paginationParamsMap[state];
                }
            });
        }
    }

})();
