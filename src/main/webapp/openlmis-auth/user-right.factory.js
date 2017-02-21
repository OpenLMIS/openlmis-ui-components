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
     * @ngdoc service
     * @name openlmis-auth.userRightFactory
     *
     * @description
     * Checks if user has right by given right name.
     */
    angular
        .module('openlmis-auth')
        .factory('userRightFactory', factory);

    factory.$inject = ['$q', 'authorizationService', 'userRightService'];

    function factory($q, authorizationService, userRightService) {

        return {
            checkRightForUser: checkRightForUser,
            checkRightForCurrentUser: checkRightForCurrentUser
        };


        /**
         * @ngdoc function
         * @name checkRightForUser
         * @methodOf openlmis-auth.userRightFactory
         *
         * @description
         * Calls the userRightService to check if given user has given right.
         *
         * @param {String} userId User UUID
         * @param {String} rightName Name of access right
         * @param {String} programId (optional) program UUID
         * @param {String} facilityId (optional) facility UUID
         * @param {String} warehouseId (optional) warehouse UUID
         * @return {Promise} true is user has right, false otherwise
         */
        function checkRightForUser(userId, rightName, programId, facilityId, warehouseId) {
            var deferred = $q.defer(),
                right = authorizationService.getRightByName(rightName);

            if(right) {
                userRightService.hasRight(userId, right.id, programId, facilityId, warehouseId).then(
                    function(response) {
                        deferred.resolve(response);
                    }, function() {
                        deferred.reject();
                    }
                );
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name checkRightForCurrentUser
         * @methodOf openlmis-auth.userRightFactory
         *
         * @description
         * Calls the userRightService to check if currently logged in user has given right.
         *
         * @param {String} rightName Name of access right
         * @param {String} programId (optional) program UUID
         * @param {String} facilityId (optional) facility UUID
         * @param {String} warehouseId (optional) warehouse UUID
         * @return {Promise} true is user has right, false otherwise
         */
        function checkRightForCurrentUser(rightName, programId, facilityId, warehouseId) {
            var deferred = $q.defer(),
                user = authorizationService.getUser();

            if(user) {
                checkRightForUser(user.user_id, rightName, programId, facilityId, warehouseId).then(function(response) {
                    deferred.resolve(response);
                }, function() {
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }
    }

})();
