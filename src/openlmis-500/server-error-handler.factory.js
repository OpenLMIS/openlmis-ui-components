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
     * @name openlmis-500.serverErrorHandler
     *
     * @description Displays alert modal when server response status has 5XX code.
     */
    angular
        .module('openlmis-500')
        .factory('serverErrorHandler', handler);

    handler.$inject = ['$q', '$injector'];

    function handler($q, $injector) {

        var canDisplayModal = true,
            provider = {
            responseError: responseError
        };
        return provider;

        /**
         * @ngdoc method
         * @methodOf openlmis-500.serverErrorHandler
         * @name  responseError
         *
         * @description
         * Takes a failed response with 5XX code displays alert modal and reject response.
         *
         * @param  {Object}  response HTTP Response
         * @return {Promise}          Rejected promise
         */
        function responseError(response) {
            if(response.status >= 500 && canDisplayModal) {
                canDisplayModal = false;
                $injector.get('alertService').error(response.statusText).then(function() {
                    canDisplayModal = true;
                });
            }
            return $q.reject(response);
        }
    }
})();
