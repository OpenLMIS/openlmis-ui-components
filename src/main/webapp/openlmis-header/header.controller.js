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
     * @name openlmis-header.controller:HeaderController
     *
     * @description
     * Controller that drives the header.
     */
    angular
        .module('openlmis-header')
        .controller('HeaderController', controller);

    controller.$inject = ['$scope', 'authorizationService', 'loginService', '$state', 'offlineService'];

    function controller($scope, authorizationService, loginService, $state, offlineService) {

        $scope.$watch(function() {
            return authorizationService.getUser();
        }, function(user) {
            $scope.user = user.username;
            $scope.userId = user.user_id;

            $scope.hasPermission = authorizationService.hasPermission;
        }, true);

        /**
         * @ngdoc method
         * @methodOf openlmis-header.controller:HeaderController
         * @name logout
         *
         * @description
         * Log outs user from application and redirects to login screen.
         */
        $scope.logout = function() {
            loginService.logout()
                .then(function() {
                    $state.go('auth.login');
                });
        };

        this.checkConnection = offlineService.checkConnection;
    }

})();
