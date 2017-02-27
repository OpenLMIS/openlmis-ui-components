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
     *
     * @ngdoc service
     * @name report.reportService
     *
     * @description
     * Responsible for retrieving requisition reports from the server.
     */
    angular
        .module('report')
        .service('reportService', service);

    service.$inject = ['openlmisUrlFactory', '$resource', '$http'];

    function service(openlmisUrlFactory, $resource, $http) {

        var resource = $resource(openlmisUrlFactory('/api/reports/templates/:module/:id'), {}, {
            getReports: {
                url: openlmisUrlFactory('/api/reports/templates/:module'),
                method: 'GET',
                isArray: true
            }
        });

        this.getReport = getReport;
        this.getReports = getReports;
        this.getReportParamsOptions = getReportParamsOptions;

        function getReport(module, id) {
            return resource.get({
                module: module,
                id: id
            }).$promise;
        }

        function getReports(module) {
            return resource.getReports({
                module: module
            }).$promise;
        }

        function getReportParamsOptions(uri) {
            return $http({
                method: 'GET',
                url: openlmisUrlFactory(uri)
            });
        }
    }
})();
