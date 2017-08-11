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
     * @ngdoc overview
     * @name openlmis-external-url.run:openExternalUrl
     *
     * @description
     * Run block that allows opening external urls.
     *
     * @example
     * ```
     * $stateProvider.state('state.name', {
     *      label: 'example state',
     *      externalUrl: 'http://external.url'
     * });
     * ```
     */
    angular
        .module('openlmis-external-url')
        .run(openExternalUrl);

    openExternalUrl.$inject = ['loadingModalService', '$rootScope', '$window'];
    function openExternalUrl(loadingModalService, $rootScope, $window) {
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                if (toState.externalUrl) {
                    event.preventDefault();
                    loadingModalService.close();
                    $window.open(toState.externalUrl);
                }
        });
    }

})();
