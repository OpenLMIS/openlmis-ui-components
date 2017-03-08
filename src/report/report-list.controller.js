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
     * @name report.controller:ReportListController
     *
     * @description
     * Controller for report list view page.
     */
    angular
        .module('report')
        .controller('ReportListController', controller);

    controller.$inject = ['$state', 'reports'];

    function controller($state, reports) {
        var vm = this;

       /**
         * @ngdoc property
         * @propertyOf report.controller:ReportListController
         * @name reports
         * @type {Array}
         *
         * @description
         * The list of all available reports.
         */
        vm.reports = reports;

        vm.goToReport = goToReport;

        /**
         * @ngdoc method
         * @methodOf report.controller:ReportListController
         * @name goToReport
         *
         * @description
         * Redirects user to report options page.
         *
         * @param {String} reportId Report UUID
         */
        function goToReport(report) {
            $state.go('reports.generate', {
                module: report.$module,
                report: report.id
            });
        }
    }
})();
