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
     * 
     * By default this service will use "page" and "size" URI parameters for storing the page number and size of the
     * list. This, however, might introduce some unexpected behavior if one state and its descendants provide an option
     * to paginate a list. In order to prevent such behavior an optional parameter can be passed to both register
     * methods, which will let the pagination service use different URI parameters for storing the information about
     * the current page and the page size. In order to utilize this feature "customPageParamName" and/or
     * "customSizeParamName" options must be provided.
     * 
     * Here's a little example on how to do it
     * ```
     * paginationService.registerUrl(stateParams, loadItemsMethod, {
     *     customPageParamName: 'customPage',
     *     customSizeParamName: 'customSize'
     * });
     * ```
     * From now on, pagination will use "customPage" and "customSize" parameters rather than "page" and "size" for
     * storing page information for the state that called it.
     */
    angular
        .module('openlmis-pagination')
        .run(run)
        .service('paginationService', service);

    run.$inject = ['paginationService'];

    function run(paginationService) {
        paginationService.init();
    }

    service.$inject = ['$q', '$state', 'PAGE_SIZE'];

    function service($q, $state, PAGE_SIZE) {

        var paginationParamsMap = {};

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
         * @param  {Function} loadItems       method that loads items
         * @param  {Object}   options         the optional configuration object, which let you specify custom parameter
         *                                    names for page and size using the "customPageParamName" and
         *                                    "customSizeParamName" properties, if they are specified parameters with
         *                                    the given names will be used for storing current page and page size
         *                                    instead of "page" and "size"
         * @return {Array}                    current page of items
         */
        function registerUrl(newStateParams, loadItems, options) {
            return register(newStateParams, loadItems, options)
                .then(function(response) {
                    paginationParamsMap[getPaginationIdFromOptions(options)] = {
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
         * @param  {Function} loadItems       method that loads items
         * @param  {Object}   options         the optional configuration object, which let you specify custom parameter
         *                                    names for page and size using the "customPageParamName" and
         *                                    "customSizeParamName" properties, if they are specified parameters with
         *                                    the given names will be used for storing current page and page size
         *                                    instead of "page" and "size"
         * @return {Array}                    current page of items
         */
        function registerList(itemValidator, newStateParams, loadItems, options) {
            return register(newStateParams, loadItems, options)
                .then(function(items) {
                    var pageParamName = getPageParamNameFromOptions(options),
                        sizeParamName = getSizeParamNameFromOptions(options);

                    paginationParamsMap[getPaginationIdFromOptions(options)] = {
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
        function getSize(paginationId) {
            return getPaginationParam(paginationId, 'size');
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
        function getPage(paginationId) {
            return getPaginationParam(paginationId, 'page');
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
        function getTotalItems(paginationId) {
            return getPaginationParam(paginationId, 'totalItems');
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
        function getShowingItems(paginationId) {
            return getPaginationParam(paginationId, 'showingItems');
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
        function isExternalPagination(paginationId) {
            return getPaginationParam(paginationId, 'externalPagination');
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
        function getPageParamName(paginationId) {
            return getPaginationParam(paginationId, 'pageParamName');
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
        function getItemValidator(paginationId) {
            return getPaginationParam(paginationId, 'itemValidator');
        }

        function getPaginationParam(paginationId, name) {
            if (paginationParamsMap[paginationId]) {
                return paginationParamsMap[paginationId][name];
            }
        }

        function register(stateParams, loadItems, options) {
            var pageParamName = getPageParamNameFromOptions(options),
                sizeParamName = getSizeParamNameFromOptions(options);

            initPaginationParams(stateParams, pageParamName, sizeParamName);

            return $q.when(loadItems(translateToRequestParams(stateParams, pageParamName, sizeParamName)));
        }

        function translateToRequestParams(stateParams, pageParamName, sizeParamName) {
            var requestParams = JSON.parse(JSON.stringify(stateParams));

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
            if (!options) {
                return defaultValue;
            }

            if (options[param]) {
                return options[param];
            }

            if (options.paginationId) {
                return options.paginationId + defaultValue.charAt(0).toUpperCase() + defaultValue.slice(1);
            }

            return defaultValue;
        }

        function getPaginationIdFromOptions(options) {
            if (options) {
                return options.paginationId;
            }
        }
    }

})();
