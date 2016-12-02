/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis.requisitions.Program
     *
     * @description
     * Allows user to perform operations on program resource.
     */
    angular.module('openlmis.requisitions').factory('Program', Program);

    Program.$inject = ['OpenlmisURL', '$resource', '$q', 'templateFactory'];

    function Program(OpenlmisURL, $resource, $q, templateFactory) {

        var resource = $resource(OpenlmisURL('/referencedata/api/programs/:id'), {}, {
            'getAll': {
                url: OpenlmisURL('/referencedata/api/programs'),
                method: 'GET',
                isArray: true
            }
        }),

        factory = {
            get: get,
            getAll: getAll
        };

        return factory;


        /**
         * @ngdoc function
         * @name  get
         * @methodOf openlmis.requisitions.Program
         * @param {String} id Program UUID
         * @returns {Promise} Program info
         *
         * @description
         * Gets program by id.
         */
        function get(id) {
            return resource.get({id: id}).$promise;
        }

        /**
         * @ngdoc function
         * @name  getAll
         * @methodOf openlmis.requisitions.Program
         * @returns {Promise} Array of all programs with templates
         *
         * @description
         * Gets all programs and adds requisition template to it.
         */
        function getAll() {
            var deferred = $q.defer();
            resource.getAll().$promise.then(function(programs) {
                getProgramTemplates(programs).then(function(items) {
                    deferred.resolve(items);
                }, function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        }

        function getProgramTemplates(programs) {
            var deferred = $q.defer();
            templateFactory.getAll().then(function(templates) {
                angular.forEach(programs, function(program, programIdx) {
                    angular.forEach(templates, function(template, templateIdx) {
                        if(program.id === template.programId) {
                            program.template = template;
                        }
                        if((programIdx === programs.length - 1) && (templateIdx === templates.length - 1))
                            deferred.resolve(programs);
                    });
                });
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        }
    }

})();
