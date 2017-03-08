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
        .module('report')
        .config(config);

    config.$inject = ['$stateProvider', 'REPORT_RIGHTS'];

    function config($stateProvider, REPORT_RIGHTS) {

        $stateProvider.state('reports.generate', {
            controller: 'ReportGenerateController',
            controllerAs: 'vm',
            templateUrl: 'report/report-generate.html',
            url: '/:module/:report/options',
            accessRights: [
                REPORT_RIGHTS.REPORTS_VIEW
            ],
            resolve: {
                report: function($stateParams, reportFactory) {
                    return reportFactory.getReport($stateParams.module, $stateParams.report);
                },
                reportParamsOptions: function(report, reportFactory) {
                    return reportFactory.getReportParamsOptions(report);
                }
            }
        });

    }

})();
