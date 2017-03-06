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
     * @name report.controller:ReportGenerateController
     *
     * @description
     * Controller for report options page
     */
    angular
        .module('report')
        .controller('ReportGenerateController', controller);

    controller.$inject = [
        '$state', '$window', 'report', 'reportParamsOptions', 'reportUrlFactory',
        'accessTokenFactory'
    ];

    function controller($state, $window, report, reportParamsOptions, reportUrlFactory,
                        accessTokenFactory) {
        var vm = this;

        vm.downloadReport = downloadReport;

        /**
         * @ngdoc property
         * @name report
         * @propertyOf report.controller:ReportGenerateController
         * @type {Object}
         *
         * @description
         * The object representing the selected report.
         */
        vm.report = report;

        /**
         * @ngdoc property
         * @name paramsOptions
         * @propertyOf report.controller:ReportGenerateController
         * @type {Array}
         *
         * @description
         * The param options for this report, by param. A param can have multiple options, for
         * example a period param, will have all available periods as options. Objects containing
         * 'value' and 'displayName' properties.
         */
        vm.paramsOptions = reportParamsOptions;

        /**
         * @ngdoc property
         * @name selectedParamsOptions
         * @propertyOf report.controller:ReportGenerateController
         * @type {Array}
         *
         * @description
         * The collection of selected options by param name.
         */
        vm.selectedParamsOptions = {};

        /**
         * @ngdoc property
         * @name format
         * @propertyOf report.controller:ReportGenerateController
         * @type {String}
         *
         * @description
         * The format selected for the report. Either 'pdf' (default), 'csv', 'xls' or 'html'.
         */
        vm.format = 'pdf';

        /**
         * @ngdoc method
         * @name downloadReport
         * @methodOf report.controller:ReportGenerateController
         *
         * @description
         * Downloads the report. Opens a new tab that redirects to the actual download report
         * url, passing selected param options as well as the selected format.
         */
        function downloadReport() {
            $window.open(
                accessTokenFactory.addAccessToken(
                    reportUrlFactory.buildUrl(
                        'requisitions',
                        vm.report,
                        vm.selectedParamsOptions,
                        vm.format
                    )
                ),
                '_blank'
            );
        }
    }
})();
