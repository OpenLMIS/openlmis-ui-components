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
     * @name openlmis-cache.cacheService
     *
     * @description
     * Basic memory cache for storing promises and their resolved values.
     */
    angular
        .module('openlmis-cache')
        .service('cacheService', service);

    service.$inject = [];

    function service() {
        var promises = {},
            data = {};

        this.cache = cache;
        this.isReady = isReady;
        this.get = get;
        this.clear = clear;

        /**
         * @ngdoc method
         * @methodOf openlmis-cache.cacheService
         * @name cache
         *
         * @description
         * Caches the value that the given promise resolves to under the given key.
         *
         * @param  {String}     key     the key of the object
         * @param  {Promise}    promise the promise for which cache the resolved value for
         * @param  {Function}   parser  the parser for the promise resolved value
         *
         * @return {Promise}            the promise resolving to parsed value returned by the
         *                              original promise
         */
        function cache(key, promise, parser) {
            promises[key] = promise.then(function(result) {
                data[key] = parser ? parser(result) : result;
                promises[key] = undefined;
                return data[key];
            });

            return promises[key];
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cache.cacheService
         * @name isReady
         *
         * @description
         * Checks whether value for the given key is ready, meaning whether the promise given for
         * that key has been resolved.
         *
         * @param  {String}     key     the key of the caches object
         * @return {Boolean}            true if the promise has been resolved, false otherwise
         */
        function isReady(key) {
            return withCheck(key, function() {
                return !promises[key];
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cache.cacheService
         * @name get
         *
         * @description
         * Retrieves the object for the given key.
         *
         * @param  {String}     key     the key of the caches object
         * @return {Object}             the resolved object if the promise has been resolved,
         *                              promise otherwise
         */
        function get(key) {
            return withCheck(key, function() {
                return promises[key] ? promises[key] : data[key];
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-cache.cacheService
         * @name get
         *
         * @description
         * Removes the cached object for the given key.
         *
         * @param  {String}     key     the key of the caches object
         *
         */
        function clear(key) {
            withCheck(key, function() {
                delete data[key];
                delete promises[key];
            });
        }

        function withCheck(key, action) {
            if (data.hasOwnProperty(key) || promises.hasOwnProperty(key)) {
                return action();
            }
        }
    }

})();
