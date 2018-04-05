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
        .module('openlmis-repository')
        .factory('ParameterSplitter', ParameterSplitter);

    ParameterSplitter.inject = ['MAX_URI_LENGTH'];

    function ParameterSplitter(MAX_URI_LENGTH) {

        ParameterSplitter.prototype.split = buildRequestsParams;

        return ParameterSplitter;

        function ParameterSplitter() {}

        function buildRequestsParams(uri, params) {
            if (shouldSplit(uri, params)) {
                var splitted = split(params);
                return buildRequestsParams(uri, splitted[0]).concat(buildRequestsParams(uri, splitted[1]));
            }
            return [params];
        }

        function shouldSplit(uri, params) {
            return buildUriWithParams(uri, params).length > 2000;
        }

        function buildUriWithParams(uri, params) {
            var uriWithParams = uri;

            Object.keys(params).forEach(function(param) {
                if (params[param] instanceof Array) {
                    params[param].forEach(function(value) {
                        uriWithParams += '&' + param + '=' + value;
                    });
                } else {
                    uriWithParams += '&' + param + '=' + params[param];
                }
            });

            return uriWithParams;
        }

        function split(params) {
            if (Object.keys(params).length === 0) {
                return [params];
            }

            var hasSplitableParams;
            Object.keys(params).forEach(function(param) {
                if (getParamList(params, param).length > 1) {
                    hasSplitableParams = true;
                }
            });

            if (!hasSplitableParams) {
                return [params];
            }

            var longestParamList = params[Object.keys(params)[0]];
            Object.keys(params).forEach(function(param) {
                if (getParamList(params, longestParamList).length < getParamList(params, param).length) {
                    longestParamList = param;
                }
            });

            var left = angular.copy(params),
                right = angular.copy(params);

            var list = getParamList(params, longestParamList),
                chunkSize = list.length / 2,
                leftOver = list.length % 2;

            left[longestParamList] = list.slice(0, chunkSize + leftOver);
            right[longestParamList] = list.slice(chunkSize + leftOver, list.length);

            return [left, right];
        }

        function getParamList(params, key) {
            if (params[key] instanceof Array) {
                return params[key];
            }
            return [params[key]];
        }

    }

})();