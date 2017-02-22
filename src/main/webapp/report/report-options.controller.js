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
     * @ngdoc controller
     * @name report.ReportOptionsController
     *
     * @description
     * Controller for report options page
     */
    angular
        .module('report')
        .controller('ReportOptionsController', controller);

    controller.$inject = ['$state', 'report', 'requisitionReportService', 'reportUrlFactory'];

    function controller($state, report, requisitionReportService, reportUrlFactory) {
        var vm = this;

        vm.report = report;
        vm.selectValues = {};
        vm.selectedValues = {};
        vm.getReportUrl = getReportUrl;

        /**
         * @ngdoc function
         * @name getReportUrl
         * @methodOf report.ReportOptionsController
         *
         * @description
         * Get URL to run report in the specified format.
         */
        function getReportUrl(format) {
            return reportUrlFactory('requisitions', vm.report, vm.selectedValues, format);
        }

        vm.$onInit = function() {
            angular.forEach(report.templateParameters, function(param) {
                requisitionReportService.getParameterValues(param.selectExpression, param.selectProperty)
                .then(function(data) {
                    vm.selectValues[param.name] = data;
                });
            });
        }
    }
})();
