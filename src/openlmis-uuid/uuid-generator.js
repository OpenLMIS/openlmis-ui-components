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
     * @name openlmis-uuid.UuidGenerator
     *
     * @description
     * Responsible for generating UUID v4 strings.
     */
    angular
        .module('openlmis-uuid')
        .factory('UuidGenerator', UuidGenerator);

    function UuidGenerator() {

        UuidGenerator.prototype.generate = generate;

        return UuidGenerator;

        /**
         * @ngdoc method
         * @methodOf openlmis-uuid.UuidGenerator
         * @name UuidGenerator
         * @constructor
         *
         * @description
         * Creates an instance of the UuidGenerator class.
         */
        function UuidGenerator() {}

        /**
         * @ngdoc method
         * @methodOf openlmis-uuid.UuidGenerator
         * @name generate
         *
         * @description
         * Generates string with UUID v4.
         * 
         * @returns {String} UUIDv4 string
         */
        function generate() {
            var d = new Date().getTime();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now();
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }
    }

})();