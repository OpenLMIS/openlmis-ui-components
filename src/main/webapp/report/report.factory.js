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
     * @name requisition-non-full-supply.categoryFactory
     *
     * @description
     * Responsible for grouping products into categories to be displayed on the Add Product modal.
     */
    angular
        .module('report')
        .factory('reportFactory', factory);

 	  factory.$inject = ['$http', '$q', 'openlmisUrlFactory'];

    function factory($http, $q, openlmisUrlFactory) {
        var factory = {
            getParameterValues: getParameterValues
        };
        return factory;

        /**
         * @ngdoc function
         * @name  getParameterValues
         * @methodOf report.requisitionReportService
         *
         * @description
         * Gets select values for report parameter based on given path.
         *
         * @param {String} path to resource.
         * @param {String} property of resource to extract.
         * @returns {Promise} Array of select values.
         */
        function getParameterValues(path, property) {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: openlmisUrlFactory(path)
            }).then(function(response) {
                var items = [];

                angular.forEach(response.data, function(obj) {
                    var value = property ? obj[property] : obj;

                    if (value) {
                        items.push(value);
                    }
                });

                deferred.resolve(items);
            }).catch(function(err) {
                deferred.reject()
            });

            return deferred.promise;
        }
    }

})();
