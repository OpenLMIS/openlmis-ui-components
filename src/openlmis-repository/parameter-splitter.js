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
     * @name openlmis-repository.ParameterSplitter
     * 
     * @description
     * Responsible for splitting parameters into smaller chunks so the build URI is not exceeding the maximum URI
     * length specified in the config file.
     */
    angular
        .module('openlmis-repository')
        .factory('ParameterSplitter', ParameterSplitter);

    ParameterSplitter.inject = ['MAX_URI_LENGTH'];

    function ParameterSplitter(MAX_URI_LENGTH) {

        ParameterSplitter.prototype.split = split;

        return ParameterSplitter;

        function ParameterSplitter() {}

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.ParameterSplitter
         * @name split
         * 
         * @description
         * Splits the given parameters map into 2 (or more) maps so the requests done using the returned maps of
         * parameters won't cause "URI too long" exception on the server.
         * 
         * @param  {string} uri    the resource URI
         * @param  {Object} params the map of query parameters
         * @return {Array}         the array of split parameter maps
         */
        function split(uri, params) {
            if (shouldSplit(uri, params)) {
                var paramsMap = splitParams(params);
                return split(uri, paramsMap.left).concat(split(uri, paramsMap.right));
            }
            return [params];
        }

        function shouldSplit(uri, params) {
            return calculateUriLength(uri, params) > MAX_URI_LENGTH && canBeSplit(params);
        }

        function calculateUriLength(uri, params) {
            var uriWithParameters = uri;

            Object.keys(params).forEach(function(param) {
                if (params[param] instanceof Array) {
                    params[param].forEach(function(value) {
                        uriWithParameters += '&' + param + '=' + value;
                    });
                } else {
                    uriWithParameters += '&' + param + '=' + params[param];
                }
            });

            return uriWithParameters.length;
        }

        function canBeSplit(params) {
            var canBeSplit;
            Object.keys(params).forEach(function(param) {
                if (getParamValues(params, param).length > 1) {
                    canBeSplit = true;
                }
            });
            return canBeSplit;
        }

        function splitParams(params) {
            var paramWithTheBiggestValuesCount = findParamWithTheBiggestValuesCount(params);

            var left = angular.copy(params),
                right = angular.copy(params);

            var list = getParamValues(params, paramWithTheBiggestValuesCount),
                chunkSize = list.length / 2,
                leftOver = list.length % 2;

            left[paramWithTheBiggestValuesCount] = list.slice(0, chunkSize + leftOver);
            right[paramWithTheBiggestValuesCount] = list.slice(chunkSize + leftOver, list.length);

            return {
                left: left,
                right: right
            };
        }

        function findParamWithTheBiggestValuesCount(params) {
            var paramWithTheBiggestValuesCount = params[Object.keys(params)[0]];

            Object.keys(params).forEach(function(param) {
                var longestValuesListLength = getParamValues(params, paramWithTheBiggestValuesCount).length,
                    paramValueListLength = getParamValues(params, param).length;

                if (longestValuesListLength < paramValueListLength) {
                    paramWithTheBiggestValuesCount = param;
                }
            });
            
            return paramWithTheBiggestValuesCount;
        }

        function getParamValues(params, key) {
            if (params[key] instanceof Array) {
                return params[key];
            }
            return [params[key]];
        }

    }

})();