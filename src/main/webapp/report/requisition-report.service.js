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

    service.$inject = ['openlmisUrlFactory', '$resource', '$http', '$q'];

    function service(openlmisUrlFactory, $resource, $http, $q){

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
            getParameterValues: getParameterValues
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
                    console.log(property);
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
