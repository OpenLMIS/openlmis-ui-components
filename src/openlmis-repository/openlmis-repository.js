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
     * @name openlmis-repository.OpenlmisRepository
     * 
     * @description
     * Basic repository which exposes methods for retrieving, creating and updating objects inside the repository.
     */
    angular
        .module('openlmis-repository')
        .factory('OpenlmisRepository', OpenlmisRepository);

    function OpenlmisRepository() {
        
        OpenlmisRepository.prototype.create = create;
        OpenlmisRepository.prototype.get = get;
        OpenlmisRepository.prototype.update = update;

        return OpenlmisRepository;

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisRepository
         * @name OpenlmisRepository
         * 
         * @description
         * Creates an instance of the OpenlmisRepository class.
         * 
         * @param {Function} domainClass the domain class to be handled by this repository, instances of this class will
         *                               be returned every time any of the method is used
         * @param {Object}   impl        the repository implementation
         */
        function OpenlmisRepository(domainClass, impl) {
            this.class = domainClass;
            this.impl = impl;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisRepository
         * @name create
         * 
         * @description
         * Saves the given object in the repository
         * 
         * @param  {Object} object the object to be created in the repository
         * @return {Object}        the created object
         */
        function create(object) {
            var DomainClass = this.class,
                repository = this;

            return this.impl.create(object)
            .then(function(response) {
                return new DomainClass(response, repository);
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisRepository
         * @name get
         * 
         * @description
         * Retrieves the object with the given id from the repository
         * 
         * @param  {Object} object the object to be created in the repository
         * @return {Object}        the matching object
         */
        function get(id) {
            var DomainClass = this.class,
                repository = this;

            return this.impl.get(id)
            .then(function(response) {
                return new DomainClass(response, repository);
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-repository.OpenlmisRepository
         * @name update
         * 
         * @description
         * Update the given object in the repository
         * 
         * @param  {Object} object the object to be updated in the repository
         * @return {Object}        the updated object
         */
        function update(object) {
            return this.impl.update(object);
        }

    }

})();