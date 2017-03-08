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
     * @name openlmis-pagination.paginatedRouter
     *
     * @description
     * Provides method for enriching a resolve object with pagination related params. If a items
     * resolve is provided it will also set total items count.
     */
    angular
        .module('openlmis-pagination')
        .provider('paginatedRouter', factory);

    factory.$inject = ['PAGE_SIZE'];

    function factory(PAGE_SIZE) {
        this.resolve = resolve;

        this.$get = [function(){}];

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginatedRouter
         * @name resolve
         *
         * @description
         * Adds pagination related resolves to the given resolve object. If the toResolve object
         * has a resolve property its content and metadata are extracted into items, totalItems,
         * page and pageSize. Otherwise page, pageSize and totalItems are calculated based on the
         * toResolve.items array.
         *
         * @param  {Object} toResolve the object to be enriched
         * @return {Object}           the enriched object
         */
        function resolve(toResolve) {
            if (toResolve.response) {
                if (!toResolve.stateParams) {
                    toResolve.stateParams = externalStateParamsResolve;
                }

                if (!toResolve.totalItems) {
                    toResolve.totalItems = externalTotalItemsResolve;
                }

                if (!toResolve.items) {
                    toResolve.items = externalItemsResolve;
                }
            } else {
                if (!toResolve.stateParams) {
                    toResolve.stateParams = stateParamsResolve;
                }

                if (!toResolve.totalItems && toResolve.items) {
                    toResolve.totalItems = totalItemsResolve;
                }
            }

            return toResolve;
        }

        function externalStateParamsResolve(response, $stateParams) {
            var stateParams = stateParamsResolve($stateParams);

            if (response && response.size !== undefined) {
                stateParams.size = response.size;
            }

            if (response && response.page !== undefined) {
                stateParams.page = response.page;
            }

            return stateParams;
        }

        function externalTotalItemsResolve(response) {
            return response ? response.totalElements : undefined;
        }

        function externalItemsResolve(response) {
            return response ? response.content : undefined;
        }

        function stateParamsResolve($stateParams) {
            var stateParams = angular.copy($stateParams);

            stateParams.size = $stateParams.size ? parseInt($stateParams.size) : PAGE_SIZE
            stateParams.page = $stateParams.page ? parseInt($stateParams.page) : 0;

            if (stateParams.offline) {
                stateParams.offline = stateParams.offline === 'true';
            }

            return stateParams;
        }

        function totalItemsResolve(items) {
            return items.length;
        }
    }

})();
