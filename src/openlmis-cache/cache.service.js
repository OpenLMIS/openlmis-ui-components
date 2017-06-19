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

        function cache(name, promise, parser) {
            promises[name] = promise

            promise.then(function(result) {
                data[name] = parser ? parser(result) : result;
                promises[name] = undefined;
            });

            return promise;
        }

        function isReady(key) {
            return withCheck(key, function() {
                return !promises[key];
            });
        }

        function get(key) {
            return withCheck(key, function() {
                return promises[key] ? promises[key] : data[key];
            });
        }

        function clear(key) {
            withCheck(key, function() {
                delete data[key];
            });
        }

        function withCheck(key, action) {
            if (data.hasOwnProperty(key) || promises.hasOwnProperty(key)) {
                return action();
            } else {
                console.error('No value for key ' + key + ' stored');
            }
        }
    }

})();
