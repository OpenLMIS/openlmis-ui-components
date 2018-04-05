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
        .factory('OpenlmisRepository', OpenlmisRepository);

    OpenlmisRepository.inject = [];

    function OpenlmisRepository() {
        
        OpenlmisRepository.prototype.create = create;
        OpenlmisRepository.prototype.get = get;
        OpenlmisRepository.prototype.update = update;

        return OpenlmisRepository;

        function OpenlmisRepository(domainClass, impl) {
            this.class = domainClass;
            this.impl = impl;
        }

        function create(object) {
            var DomainClass = this.class,
                repository = this;

            return this.impl.create(object)
            .then(function(response) {
                return new DomainClass(response, repository);
            });
        }

        function get(id) {
            var DomainClass = this.class,
                repository = this;

            return this.impl.get(id)
            .then(function(response) {
                return new DomainClass(response, repository);
            });
        }

        function update(object) {
            return this.impl.update(object);
        }

    }

})();