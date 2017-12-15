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
     * @name openlmis-abstract-factory.AbstractFactory
     *
     * @description
     * Abstract class for transferring an array of server responses into a list of objects.
     * If a function is not provided an exception will be thrown when nstantiating and object of
     * that class.
     */
    angular
        .module('openlmis-abstract-factory')
        .factory('AbstractFactory', AbstractFactory);

    function AbstractFactory() {

        AbstractFactory.prototype.buildFromResponseArray = buildFromResponseArray;

        return AbstractFactory;

        /**
         * @ngdoc method
         * @methodOf openlmis-abstract-factory.AbstractFactory
         * @name AbstractFactory
         * @constructor
         *
         * @description
         * Responsible for checking whether function was given as parameter.
         */
        function AbstractFactory(buildFromResponse) {
            if (!buildFromResponse || !(buildFromResponse instanceof Function)) {
                throw 'Extending class must implement buildFromResponse method';
            }
            this.buildFromResponse = buildFromResponse;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-abstract-factory.AbstractFactory
         * @name buildFromResponseArray
         *
         * @description
         * Builds a list of objects from the list of server responses.
         *
         * @param  {Array}  responses   the list of server responses
         * @return {Array}              the list of objects
         */
        function buildFromResponseArray(responses) {
            var factory = this,
                objects = [];

            responses.forEach(function(response) {
                objects.push(factory.buildFromResponse(response));
            });

            return objects;
        }
    }

})();
