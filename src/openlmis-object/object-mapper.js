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
     * @name openlmis-object.ObjectMapper
     *
     * @description
     * Responsible for preparing a map with object id as a key and name as a value.
     */
    angular
        .module('openlmis-object')
        .factory('ObjectMapper', ObjectMapper);

    ObjectMapper.inject = ['$q'];

    function ObjectMapper($q) {

        ObjectMapper.prototype.get = get;

        return ObjectMapper;

        /**
         * @ngdoc method
         * @methodOf openlmis-object.ObjectMapper
         * @name ObjectMapper
         * @constructor
         *
         * @description
         * Creates an instance of the ObjectMapper class.
         */
        function ObjectMapper() {}

        /**
         * @ngdoc method
         * @methodOf openlmis-object.ObjectMapper
         * @name get
         *
         * @description
         * Maps the object name by object id and returns promise.
         */
        function get(objectList) {
            var map = {};
            objectList.forEach(function(object) {
                map[object.id] = object.name;
            });
            return $q.resolve(map);
        }

    }

})();