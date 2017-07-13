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
     * @name openlmis-state-change-error.stateChangeErrorInterceptor
     *
     * @description
     * Displays error on the console if application fails to change state. Those errors are not
     * displayed in console by default. If the error is a failed HTTP request response the alert
     * won't be shown and nothing will be printed in the browser console.
     */
    angular
        .module('openlmis-state-change-error')
        .run(stateChangeErrorInterceptor);

    stateChangeErrorInterceptor.$inject = ['$rootScope', 'alertService'];

    function stateChangeErrorInterceptor($rootScope, alertService) {
        $rootScope.$on('$stateChangeError', handleStateChangeError);

        function handleStateChangeError(event, toState, toParams, fromState, fromParams, error) {
            if (!isResponse(error)) {
                alertService.error(
                    'openlmisStateChangeError.internalApplicationError.title',
                    'openlmisStateChangeError.internalApplicationError.message'
                );
                console.error(error);
            }
        }

        function isResponse(error) {
            return error &&
                error.hasOwnProperty('status') &&
                error.hasOwnProperty('statusText') &&
                error.hasOwnProperty('data');
        }
    }

})();
