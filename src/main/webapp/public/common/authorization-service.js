(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-common.AuthorizationService
     *
     * @description
     * This service is responsible for storing user authentication details, such as the current
     * user's authorization rights and user object. This service only stores information, other
     * services and factories are responsible for writing user information to the
     * AuthorizationService.
     */
    angular
        .module('openlmis-core')
        .service('AuthorizationService', service)

    var storageKeys = {
        'ACCESS_TOKEN': 'ACCESS_TOKEN',
        'USER_ID': 'USER_ID',
        'USERNAME': 'USERNAME',
        'USER_ROLE_ASSIGNMENTS': 'ROLE_ASSIGNMENTS'
    };

    service.$inject = ['$q', 'localStorageService', '$injector', '$filter']

    function service($q, localStorageService, $injector, $filter) {

        this.clearAccessToken = clearAccessToken;
        this.clearUser = clearUser;
        this.clearRights = clearRights;
        this.getAccessToken = getAccessToken;
        this.getDetailedUser = getDetailedUser;
        this.getRights = getRights;
        this.getUser = getUser;
        this.hasRight = hasRight;
        this.isAuthenticated = isAuthenticated;
        this.setAccessToken = setAccessToken;
        this.setRights = setRights;
        this.setUser = setUser;

        /**
         * @ngdoc function
         * @name getAccessToken
         * @methodOf openlmis-common.AuthorizationService
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
         * @methodOf openlmis-common.AuthorizationService
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
         * @methodOf openlmis-common.AuthorizationService
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
         * @methodOf openlmis-common.AuthorizationService
         *
         * @description
         * Checks whether user is authenticated.
         *
         * @return {Boolean} true if the user is authenticated, false otherwise
         */
        function isAuthenticated() {;
            return !!getAccessToken();
        }

        /**
         * @ngdoc function
         * @name getUser
         * @methodOf openlmis-common.AuthorizationService
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
            return $injector.get('UserFactory').get(user.user_id);
        }

        /**
         * @ngdoc function
         * @name setUser
         * @methodOf openlmis-common.AuthorizationService
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
         * @methodOf openlmis-common.AuthorizationService
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
         * @methodOf openlmis-common.AuthorizationService
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
         * @methodOf openlmis-common.AuthorizationService
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
         * @methodOf openlmis-common.AuthorizationService
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

            if (rights.length) {
                var right = rights[0],
                    hasRight = true;

                if (rightName && details) {
                    var program = details.programCode,
                        facility = details.warehouseCode,
                        node = details.supervisoryNodeCode;

                    if (program) {
                        hasRight = hasRight && right.programs.indexOf(program) > -1;
                    }

                    if (facility) {
                        hasRight = hasRight && right.facilities.indexOf(facility) > -1;
                    }

                    if (node) {
                        hasRight = hasRight && right.nodes.indexOf(node) > -1;
                    }
                }

                return hasRight;
            }

            return false;
        }

        /**
         * @ngdoc function
         * @name  clearRights
         * @methodOf openlmis-common.AuthorizationService
         *
         * @description
         * Removes user rights from the local storage.
         */
        function clearRights() {
            localStorageService.remove(storageKeys.USER_ROLE_ASSIGNMENTS);
        }
    }

})();
