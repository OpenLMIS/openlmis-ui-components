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
     * @ngdoc filter
     * @name admin-template.filter:orderObjectBy
     *
     * @description
     * Orders object properties by given attribute.
     *
     * @param  {Object} value object to be sorted by given attribute
     * @param  {String} key   object properties will be sorted using this key
     * @return {Array}        sorted properties
     */
    angular.module('admin-template').filter('orderObjectBy', function(){
        return function(input, attribute) {
            if (!angular.isObject(input)) return input;

            var columns = [];

            for(var objectKey in input) {
                columns.push(input[objectKey]);
            }
            return columns.sort(sort);

            function sort(a, b) {
                a = parseInt(a[attribute]);
                b = parseInt(b[attribute]);
                return a - b;
            }
        }
    });
})();
