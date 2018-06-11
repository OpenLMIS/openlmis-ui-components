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
     * @name openlmis-object-utils.ObjectMapper
     *
     * @description
     * Responsible for preparing a map with object id as a key and name as a value.
     */
    angular
        .module('openlmis-object-utils')
        .factory('ObjectMapper', ObjectMapper);

    ObjectMapper.inject = ['$q'];

    function ObjectMapper($q) {

        ObjectMapper.prototype.map = map;

        return ObjectMapper;

        /**
         * @ngdoc method
         * @methodOf openlmis-object-utils.ObjectMapper
         * @name ObjectMapper
         * @constructor
         *
         * @description
         * Creates an instance of the ObjectMapper class.
         */
        function ObjectMapper() {}

        /**
         * @ngdoc method
         * @methodOf openlmis-object-utils.ObjectMapper
         * @name map
         *
         * @description
         * Maps the object (or property) name to object id and returns promise.
         */
        function map(objectList, propertyName) {
            if (!objectList) {
                return undefined;
            }

            var map = objectList.reduce(function(map, object) {
                map[object.id] = propertyName ? object[propertyName] : object;
                return map;
            }, {});

            return $q.resolve(map);
        }

    }

})();