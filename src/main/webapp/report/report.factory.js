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
     * @name report.reportFactory
     *
     * @description
     * Responsible for grouping products into categories to be displayed on the Add Product modal.
     */
    angular
        .module('report')
        .factory('reportFactory', factory);

    factory.$inject = ['$http', '$q', 'openlmisUrlFactory', 'reportService'];

    function factory($http, $q, openlmisUrlFactory, reportService) {
        var factory = {
            getReport: getReport,
            getReports: getReports,
            getAllReports: getAllReports,
            getReportParamsOptions: getReportParamsOptions
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf report.reportFactory
         * @name getReport
         *
         * @description
         * Retrieves a report with the given ID for a module. Uses getReport() from the report
         * service.
         *
         * @param  {String}   module The module to retrieve the report from (for example
                                     requisitions).
         * @param  {String}   id     The ID of the report.
         * @return {Promise}         The promise for the report.
         */
        function getReport(module, id) {
            var deferred = $q.defer();

            reportService.getReport(module, id).then(function(report) {
                report.$module = module;
                deferred.resolve(report);
            }, deferred.reject);

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf report.reportFactory
         * @name getReports
         *
         * @description
         * Retrieves all reports for the given module. Uses getReport() from the report service.
         *
         * @param  {String}  module The module to retrieve the report from (for example requisitions).
         * @return {Promise}        The promise for the report array.
         */
        function getReports(module) {
            var deferred = $q.defer();

            reportService.getReports(module).then(function(reports) {
                angular.forEach(reports, function(report) {
                    report.$module = module;
                });
                deferred.resolve(reports);
            }, deferred.reject);

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf report.reportFactory
         * @name getReportParamsOptions
         *
         * @description
         * Retrieves all reports, from all available modules. Currently 'requisitions' is the only
         * supported report module.
         *
         * @return {Promise} The promise for all the reports.
         */
        function getAllReports() {
            var promises = [],
                deferred = $q.defer();

            angular.forEach(['requisitions'], function(module) {
                promises.push(getReports(module));
            });

            $q.all(promises).then(function(reportLists) {
                var allReports = [];

                angular.forEach(reportLists, function(reportList) {
                    allReports = allReports.concat(reportList);
                });

                deferred.resolve(allReports);
            }, deferred.reject);

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf report.reportFactory
         * @name getReportParamsOptions
         *
         * @description
         * Retrieves parameter options for a report - each report gives the user an option to
         * select parameters that apply only this report. This returns options for all params of
         * the report.
         *
         * @param  {String}  report The report object for which params should be retrieved.
         * @return {Promise}        The promise for report params.
         */
        function getReportParamsOptions(report) {
            var deferred = $q.defer(),
                promises = [],
                parameters = {};

            angular.forEach(report.templateParameters, function(param) {
                var paramDeferred = $q.defer();

                if (param.selectExpression != null) {
                    promises.push(paramDeferred.promise);

                    getReportParamOptions(
                        param.selectExpression,
                        param.selectProperty,
                        param.displayProperty
                    ).then(function(params) {
                        parameters[param.name] = params;
                        paramDeferred.resolve();
                    }, paramDeferred.reject);
                }
            });

            $q.all(promises).then(function() {
                deferred.resolve(parameters);
            }, deferred.reject);

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf report.reportFactory
         * @name getReportParamsOptions
         *
         * @description
         * Retrieves parameter options for a report param - each report gives the user an option to
         * select parameters that apply only to this report. Uses getReportParamsOptions() from the
         * report service. This returns a list of items available as options for the param, each
         * with a 'value' and a 'displayName'
         * property.
         *
         * @param  {String}   uri         The uri under which the param options will be retrieved.
         * @param  {String}   property    The name of the property that will be treated as the value
         *                                of the param (from the retrieved JSON). If not provided,
         *                                the object itself will be treated as the value.
         * @param  {String}   displayName The name of the property that will be treated as the display
         *                                name of the param (from the retrieved JSON). If not
                                          provided, the value will be used as a display name.
         * @return {Promise}              The promise for report params.
         */
        function getReportParamOptions(uri, property, displayName) {
            var deferred = $q.defer();

            reportService.getReportParamsOptions(uri).then(function(response) {
                var items = [];

                // Support paginated endpoints
                var data = response.data;
                if (data.content && data.totalElements > 0) {
                  data = data.content;
                }

                angular.forEach(data, function(obj) {
                    var value = property ? obj[property] : obj;
                    var name = displayName ? obj[displayName] : value;

                    if (value) {
                        items.push({
                            'name': name,
                            'value': value
                        });
                    }
                });

                deferred.resolve(items);
            }, deferred.reject);

            return deferred.promise;
        }
    }

})();
