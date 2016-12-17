(function(){
    'use strict';

    /**
    *
    * @ngdoc service
    * @name openlmis-auth.LoginService
    * @description
    * Facilitates the login process between the OpenLMIS Server and the UI client. This service works with the AuthorizationService, which is responsible for storing implementation details.
    *
    */

    angular
        .module('openlmis-auth')
        .service('LoginService', LoginService);

    LoginService.$inject = ['$rootScope', '$q', '$http', 'AuthURL', 'OpenlmisURL', 'AuthorizationService',
                            'Right', '$state'];

    function LoginService($rootScope, $q, $http, AuthURL, OpenlmisURL, AuthorizationService, Right, $state) {
        var service = {};

        service.login = login;
        service.logout = logout;

        /**
        *
        * @ngdoc function
        * @name login
        * @methodOf openlmis-auth.LoginService
        *
        * @param {String} username The name of the person trying to login
        * @param {String} password The password the person is trying to login with
        *
        * @description
        * Makes an HTTP request to login the user.
        *
        * This method returns a function that will return a promise with no value.
        *
        */

        function login(username, password){
            var deferred = $q.defer();
            var authHeader = 'Basic '+ btoa(
                '@@AUTH_SERVICE_CLIENT_ID' // replaced on build by config.authService.cliendId
                + ':'
                + '@@AUTH_SERVICE_CLIENT_SECRET' // replaced on build by config.authService.clientSecret
            );
            $http({
                method: 'POST',
                url: AuthURL('/api/oauth/token?grant_type=password'),
                data: 'username=' + username + '&password=' + password,
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response) {
                AuthorizationService.setAccessToken(response.data.access_token);
                getUserInfo(response.data.referenceDataUserId).then(function() {
                    getUserRights(response.data.referenceDataUserId).then(function() {
                        if ($state.is('auth.login.form')) {
                            $rootScope.$emit('auth.login');
                        } else {
                            $rootScope.$emit('auth.login-modal');
                        }
                        deferred.resolve();
                    }, function(){
                        AuthorizationService.clearAccessToken();
                        deferred.reject();
                    });
                }, function(){
                    AuthorizationService.clearAccessToken();
                    deferred.reject();
                });
            }, function() { // catch HTTP error
                deferred.reject();
            });
            return deferred.promise;
        }

        /**
        *
        * @ngdoc function
        * @name logout
        * @methodOf openlmis-auth.LoginService
        *
        * @description
        * Calls the server, and removes from authorization service.
        *
        */

        function logout(){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: AuthURL('/api/users/logout')
            }).then(function() {

                AuthorizationService.clearAccessToken();
                AuthorizationService.clearUser();
                AuthorizationService.clearRights();

                deferred.resolve();
            }, function(){
                deferred.reject();
            });
            return deferred.promise;
        }

        function getUserInfo(userId){
            var deferred = $q.defer();
            if(!AuthorizationService.isAuthenticated()) {
                deferred.reject();
            } else {
                var userInfoURL = AuthURL(
                    '/api/users/' + userId
                );
                $http({
                    method: 'GET',
                    url: userInfoURL,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    AuthorizationService.setUser(userId, response.data.username);
                    //getUserRights(userId);
                    deferred.resolve();
                }).catch(function() {
                    deferred.reject();
                });
            }
            return deferred.promise;
        }

        function getUserRights(userId) {
            var deferred = $q.defer();

            if(!AuthorizationService.isAuthenticated()) {
                deferred.reject();
            } else {
                var userRoleAssignmentsURL = OpenlmisURL(
                    '/api/users/' + userId + '/roleAssignments'
                );
                $http({
                    method: 'GET',
                    url: userRoleAssignmentsURL,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    AuthorizationService.setRights(Right.buildRights(response.data));
                    deferred.resolve();
                }).catch(function() {
                    deferred.reject();
                });
            }
            return deferred.promise;
        }

        return service;
    }

})();
