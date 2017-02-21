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
     * @name openlmis-auth.authorizationService
     *
     * @description
     * This service is responsible for storing user authentication details, such as the current
     * user's authorization rights and user object. This service only stores information, other
     * services and factories are responsible for writing user information to the
     * authorizationService.
     */
    angular
        .module('openlmis-auth')
        .service('authorizationService', service)

    var storageKeys = {
        'ACCESS_TOKEN': 'ACCESS_TOKEN',
        'USER_ID': 'USER_ID',
        'USERNAME': 'USERNAME',
        'USER_ROLE_ASSIGNMENTS': 'ROLE_ASSIGNMENTS'
    };

    service.$inject = ['$q', 'localStorageService', '$injector', '$filter', 'localStorageFactory', 'md5']

    function service($q, localStorageService, $injector, $filter, localStorageFactory, md5) {

        var offlineUserData = localStorageFactory('userData');

        this.clearAccessToken = clearAccessToken;
        this.clearUser = clearUser;
        this.clearRights = clearRights;
        this.getAccessToken = getAccessToken;
        this.getDetailedUser = getDetailedUser;
        this.getRights = getRights;
        this.getUser = getUser;
        this.hasRight = hasRight;
        this.hasRights = hasRights;
        this.isAuthenticated = isAuthenticated;
        this.setAccessToken = setAccessToken;
        this.setRights = setRights;
        this.setUser = setUser;
        this.getRightByName = getRightByName;
        this.saveOfflineUserData = saveOfflineUserData;
        this.getOfflineUserData = getOfflineUserData;
        this.hashPassword = hashPassword;

        /**
         * @ngdoc function
         * @name getAccessToken
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Retrives the current access token.
         *
         * @return {String} the current access token
         */
        function getAccessToken() {
            return localStorageService.get(storageKeys.ACCESS_TOKEN);
        }

        /**
         * @ngdoc function
         * @name setAccessToken
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Sets the access token.
         *
         * @param {String}  token   the token to be stored
         */
        function setAccessToken(token) {
            localStorageService.add(storageKeys.ACCESS_TOKEN, token);
        }

        /**
         * @ngdoc function
         * @name clearAccessToken
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Removed the stored token from the local storage.
         */
        function clearAccessToken() {
            return localStorageService.remove(storageKeys.ACCESS_TOKEN);
        }

        /**
         * @ngdoc function
         * @name isAuthenticated
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Checks whether user is authenticated.
         *
         * @return {Boolean} true if the user is authenticated, false otherwise
         */
        function isAuthenticated() {
            return !!getAccessToken();
        }

        /**
         * @ngdoc function
         * @name getUser
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Retrieves basic information(usename and user ID) about the user.
         *
         * @return {Object} the basic information about the user
         */
        function getUser() {
            return {
                username: localStorageService.get(storageKeys.USERNAME),
                user_id: localStorageService.get(storageKeys.USER_ID)
            };
        }

        /**
         * @ngdoc function
         * @name getDetailedUser
         * @methodOf
         *
         * @description
         * Retrieves detailed information about the user.
         *
         * @return {Object} the detailed information about the user
         */
        function getDetailedUser() {
            var user = getUser();
            return $injector.get('userFactory').get(user.user_id);
        }

        /**
         * @ngdoc function
         * @name setUser
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Saves the given user ID and username to the local storage.
         *
         * @param {String}      username    Username for the current user
         * @param {String}      user_id     User ID for the current user
         */
        function setUser(user_id, username) {
            localStorageService.add(storageKeys.USERNAME, username);
            localStorageService.add(storageKeys.USER_ID, user_id);
        }

        /**
         * @ngdoc function
         * @name clearUser
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Removes the username and user ID from the local storage.
         */
        function clearUser() {
            localStorageService.remove(storageKeys.USERNAME);
            localStorageService.remove(storageKeys.USER_ID);
        }

        /**
         * @ngdoc function
         * @name setRights
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Saves the given rights to the local storage.
         *
         * @param {Array}   rights   the list of rights
         */
        function setRights(rights) {
            localStorageService.add(
                storageKeys.USER_ROLE_ASSIGNMENTS,
                angular.toJson(rights)
            );
        }

        /**
         * @ngdoc function
         * @name  getRights
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Retrieves the list of user rights from the local storage.
         *
         * @return {Array}  the list of user rights
         */
        function getRights() {
            return angular.fromJson(localStorageService.get(storageKeys.USER_ROLE_ASSIGNMENTS));
        }

        /**
         * @ngdoc function
         * @name hasRight
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Checks whether user has the given right. If the details object is passed the validation
         * will be more strict.
         *
         * @param  {String}     rightName   the name of the right
         * @param  {Oject}      details     (optional) the details about the right
         * @return {Boolean}                true if the user has the right, false Otherwise
         */
        function hasRight(rightName, details) {
            var rights = $filter('filter')(getRights(), {
                name: rightName
            }, true);

            if (!rights) return false;

            if (rights.length) {
                var right = rights[0],
                    hasRight = true;

                if (rightName && details) {

                    if (details.programCode) {
                        hasRight = hasRight && right.programCodes.indexOf(details.programCode) > -1;
                    }

                    if (details.programId) {
                        hasRight = hasRight && right.programIds.indexOf(details.programId) > -1;
                    }

                    if (details.warehouseCode) {
                        hasRight = hasRight && right.warehouseCodes.indexOf(details.warehouseCode) > -1;
                    }

                    if (details.warehouseId) {
                        hasRight = hasRight && right.warehouseIds.indexOf(details.warehouseId) > -1;
                    }

                    if (details.supervisoryNodeCode) {
                        hasRight = hasRight && right.supervisoryNodeCodes.indexOf(details.supervisoryNodeCode) > -1;
                    }

                    if (details.supervisoryNodeId) {
                        hasRight = hasRight && right.supervisoryNodeIds.indexOf(details.supervisoryNodeId) > -1;
                    }
                }

                return hasRight;
            }

            return false;
        }

        function hasRights(rights, areAllRightsRequired) {
            var hasPermission;
            if(areAllRightsRequired) {
                hasPermission = true;
                angular.forEach(rights, function(right) {
                    if(!hasRight(right)) hasPermission = false;
                });
                return hasPermission;
            } else {
                hasPermission = false;
                angular.forEach(rights, function(right) {
                    if(hasRight(right)) hasPermission = true;
                });
                return hasPermission;
            }
        }

        /**
         * @ngdoc function
         * @name  clearRights
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Removes user rights from the local storage.
         */
        function clearRights() {
            localStorageService.remove(storageKeys.USER_ROLE_ASSIGNMENTS);
        }

        /**
         * @ngdoc function
         * @name  getRightByName
         * @methodOf openlmis-auth.authorizationService
         *
         * @description
         * Returns id of right with given name.
         */
        function getRightByName(rightName) {
            var rights = $filter('filter')(getRights(), {
                name: rightName}, true);
            return angular.copy(rights[0]);
        }

        function saveOfflineUserData(username, password, userId, referencedataUsername, userRights) {
            if(offlineUserData.getBy('username', username)) offlineUserData.removeBy('username', username);
            offlineUserData.put({
                username: username,
                password: hashPassword(password),
                id: userId,
                referencedataUsername: referencedataUsername,
                rights: userRights
            });
        }

        function getOfflineUserData(username) {
            return offlineUserData.getBy('username', username);
        }

        function hashPassword(password) {
            return md5.createHash(password || '');
        }
    }

})();
