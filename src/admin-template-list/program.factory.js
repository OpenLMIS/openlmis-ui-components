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


(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name admin-template-list.programFactory
     *
     * @description
     * Allows the user to retrieve programs with additional information.
     */
    angular
        .module('admin-template-list')
        .factory('programFactory', factory);

    factory.$inject = ['openlmisUrlFactory', '$q', 'programService', 'templateFactory'];

    function factory(openlmisUrlFactory, $q, programService, templateFactory){

        return {
            getAllProgramsWithTemplates: getAllProgramsWithTemplates
        };

        /**
         * @ngdoc method
         * @methodOf admin-template-list.programFactory
         * @name getAllProgramsWithTemplates
         *
         * @description
         * Retrieves all programs and adds templates to them if one exists.
         *
         * @return {Promise} Array of programs with templates
         */
        function getAllProgramsWithTemplates() {
            var deferred = $q.defer();

            programService.getAll().then(function(programs) {
                templateFactory.getAll().then(function(templates) {
                    angular.forEach(programs, function(program, programIdx) {
                        angular.forEach(templates, function(template, templateIdx) {
                            if(program.id === template.programId) {
                                program.$template = template;
                            }
                            if((programIdx === programs.length - 1) && (templateIdx === templates.length - 1))
                                deferred.resolve(programs);
                        });
                    });
                }, function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }
    }

})();
