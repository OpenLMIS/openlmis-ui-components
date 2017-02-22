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
 	 * @name report.reportUrlFactory
 	 *
 	 * @description
 	 * A factory that takes a URL and prepends the reports path to the url.
 	 */
 	angular
    .module('report')
    .factory('reportUrlFactory', factory);

 	factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

 	function factory(openlmisUrlFactory, pathFactory) {
    var reportUrl = '/api/reports/templates';

    /**
     * @param  {String} url The url fragment to prepend the reports url before
     * @param  {String} report The report to return url for
     * @param  {String} selectedValues The values selected for report parameters
     * @param  {String} format The format of report to return url for
     * @return {String} url that is directed towards the OpenLMIS Reporting
     */
    return function(url, report, selectedValues, format) {
      url = pathFactory(reportUrl, url, report.id, format);

      var requestParameters = "";
      angular.forEach(report.templateParameters, function (parameter) {
        requestParameters = requestParameters + parameter.name + "=" + selectedValues[parameter.name] + "&&";
      });

      return openlmisUrlFactory(url + '?' + requestParameters);
    }
 	}

 })();
