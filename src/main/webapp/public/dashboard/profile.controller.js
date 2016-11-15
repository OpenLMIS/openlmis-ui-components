/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function(){
    "use strict";

    /**
     * @ngdoc controller
     * @name openlmis-dashboard.UserProfileController
     *
     * @description
     * 
     * Allows user to change ist own profile info.
     * 
     */

    angular.module('openlmis-dashboard')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['$scope', 'user', 'NotificationModal'] 
    function UserProfileController($scope, user, NotificationModal) {

        $scope.userProfile = user;
        $scope.errorMessage = getErrorMessage;

        /**
         * @ngdoc function
         * @name  getInfoMessage
         * @methodOf openlmis-dashboard.UserProfileController
         * @returns {String} errror message to display
         * 
         * @description
         *
         * Displays info when there is no user info or no role assignmets
         */
        function getErrorMessage() {
            if (!$scope.userProfile) {
                return 'msg.rnr.get.user.info.error';
            }
            return null;
        }
    }

})();
