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
     *
     * @ngdoc service
     * @name report.requisitionReportService
     *
     * @description
     * Responsible for retrieving requisition reports from the server.
     */
    angular
        .module('report')
        .factory('requisitionReportService', service);

    service.$inject = ['reportFactory', 'openlmisUrlFactory', '$resource', '$q'];

    function service(reportFactory, openlmisUrlFactory, $resource, $q){

        var resource = $resource(openlmisUrlFactory('/api/reports/templates/requisitions/:id'), {}, {
            'getAll': {
                url: openlmisUrlFactory('/api/reports/templates/requisitions'),
                method: 'GET',
                isArray: true
            }
        });

        return {
            get: get,
            getAll: getAll,
            getParameterOptions: reportFactory.getParameterOptions
        };

        /**
         * @ngdoc function
         * @name  get
         * @methodOf report.requisitionReportService
         *
         * @description
         * Gets report by id.
         *
         * @param {String} id Report UUID
         * @returns {Promise} Report info
         */
        function get(id) {
            return resource.get({id: id}).$promise;
        }

        /**
         * @ngdoc function
         * @name  getAll
         * @methodOf report.requisitionReportService
         *
         * @description
         * Gets all reports.
         *
         * @returns {Promise} Array of all reports
         */
        function getAll() {
            return resource.getAll().$promise;
        }
    }
})();
