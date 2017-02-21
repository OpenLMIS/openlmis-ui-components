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

    angular
        .module('openlmis-auth')
        .service('authStateRouter', router);

    router.$inject = ['$rootScope', '$state', 'authorizationService', 'alertService',
        'loadingModalService'
    ];

    function router($rootScope, $state, authorizationService, alertService, loadingModalService) {
        var savedToState, savedToParams;

        this.initialize = initialize;

        function initialize() {
            $rootScope.$on('$stateChangeStart', reroute);

            $rootScope.$on('auth.login', function(){
                if (savedToState) {
                    goToSavedState();
                } else {
                    $state.go('home');
                }
            });

            $rootScope.$on('event:auth-loggedIn', goToSavedState);
        }

        function reroute(event, toState, toParams, fromState, fromParams) {
            if(!authorizationService.isAuthenticated() && toState.name.indexOf('auth') != 0 && toState.name.indexOf('home') != 0){
                // if not authenticated and not on login page or home page
                event.preventDefault();
                loadingModalService.close();
                if (fromState.name.indexOf('auth.login') !== 0) {
                    $rootScope.$emit('event:auth-loginRequired', true);
                }
                savedToState = toState.name;
                savedToParams = toParams;
            } else if(!authorizationService.isAuthenticated() &&  toState.name.indexOf('home') == 0){
                // if not authenticated and on home page
                event.preventDefault();
                $state.go('auth.login');
            } else if(authorizationService.isAuthenticated() && toState.name.indexOf('auth') == 0) {
                // if authenticated and on login page
                event.preventDefault();
                $state.go('home');
            } else if(toState.accessRights && !authorizationService.hasRights(toState.accessRights, toState.areAllRightsRequired)) {
                // checking rights to enter state
                event.preventDefault();
                alertService.error('error.authorization');
            }
        }

        function goToSavedState() {
            $state.go(savedToState, savedToParams);
            savedToState = undefined;
            savedToParams = undefined;
        }

    }

})();
