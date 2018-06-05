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

        var stateName, previousStateParams, paginationParamsMap = {};

        this.init = init;
        this.registerUrl = registerUrl;
        this.registerList = registerList;
        this.getSize = getSize;
        this.getPage = getPage;
        this.getTotalItems = getTotalItems;
        this.getShowingItems = getShowingItems;
        this.isExternalPagination = isExternalPagination;
        this.getPageParamName = getPageParamName;
        this.getItemValidator = getItemValidator;

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
         * @param  {Function} loadItems method that loads items
         * @return {Array}                    current page of items
         */
        function registerUrl(newStateParams, loadItems, options) {
            return register(newStateParams, loadItems, options)
            .then(function(response) {
                paginationParamsMap[stateName] = {
                    size: response ? response.size : 0,
                    page: response ? response.number : 0,
                    totalItems: response ? response.totalElements : 0,
                    showingItems: response && response.content ? response.content.length : 0,
                    externalPagination: true,
                    pageParamName: getPageParamNameFromOptions(options),
                    sizeParamName: getSizeParamNameFromOptions(options)
                };
                return response ? response.content : [];
            });
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
         * @param  {Function} loadItems method that loads items
         * @return {Array}                    current page of items
         */
        function registerList(itemValidator, newStateParams, loadItems, options) {
            return register(newStateParams, loadItems, options)
            .then(function(items) {
                var pageParamName = getPageParamNameFromOptions(options),
                    sizeParamName = getSizeParamNameFromOptions(options);

                paginationParamsMap[stateName] = {
                    size: parseInt(newStateParams[sizeParamName]),
                    page: parseInt(newStateParams[pageParamName]),
                    totalItems: items.length,
                    externalPagination: false,
                    pageParamName: pageParamName,
                    sizeParamName: sizeParamName,
                    itemValidator: itemValidator
                };
                return items;
            });
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

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name getPageParamName
         *
         * @description
         * Returns the name of the custom page parameter.
         *
         * @return {String} the name of the custom page parameter
         */
        function getPageParamName() {
            return getPaginationParam('pageParamName');
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationService
         * @name getItemValidator
         *
         * @description
         * Returns item validation function.
         *
         * @return {Function} the item validator
         */
        function getItemValidator() {
            return getPaginationParam('itemValidator');
        }

        function getPaginationParam(name) {
            if (paginationParamsMap[$state.current.name]) {
                return paginationParamsMap[$state.current.name][name];
            }
        }

        function register(stateParams, loadItems, options) {
            var pageParamName = getPageParamNameFromOptions(options),
                sizeParamName = getSizeParamNameFromOptions(options);

            initPaginationParams(stateParams, pageParamName, sizeParamName);

            if (shouldChangePageToFirstOne(stateParams, pageParamName)) {
                stateParams[pageParamName] = 0;
            }

            previousStateParams = stateParams;

            return $q.when(loadItems(translateToRequestParams(stateParams, pageParamName, sizeParamName)));
        }

        function shouldChangePageToFirstOne(newStateParams, pageParamName) {
            return $state.current.name === stateName && !angular.equals(previousStateParams, newStateParams) &&
                previousStateParams && newStateParams[pageParamName] === previousStateParams[pageParamName];
        }

        function clearPaginationParamsMap(toState) {
            Object.keys(paginationParamsMap).forEach(function(state) {
                if (toState.indexOf(state) === -1) {
                    delete paginationParamsMap[state];
                }
            });
        }

        function translateToRequestParams(stateParams, pageParamName, sizeParamName) {
            var requestParams = angular.copy(stateParams);

            if (pageParamName !== 'page') {
                requestParams.page = requestParams[pageParamName];
                delete requestParams[pageParamName];
            }

            if (sizeParamName !== 'size') {
                requestParams.size = requestParams[sizeParamName];
                delete requestParams[sizeParamName];
            }

            return requestParams;
        }

        function initPaginationParams(stateParams, pageParamName, sizeParamName) {
            if (!stateParams[pageParamName]) {
                stateParams[pageParamName] = 0;
            }
            if (!stateParams[sizeParamName]) {
                stateParams[sizeParamName] = PAGE_SIZE;
            }
        }

        function getPageParamNameFromOptions(options) {
            return getParamNameFromOptions(options, 'customPageParamName', 'page');
        }

        function getSizeParamNameFromOptions(options) {
            return getParamNameFromOptions(options, 'customSizeParamName', 'size');
        }

        function getParamNameFromOptions(options, param, defaultValue) {
            if (!options || !options[param]) {
                return defaultValue;
            }
            return options[param];
        }
    }

})();
