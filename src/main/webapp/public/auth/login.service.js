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

        function makeAuthorizationHeader(clientId, clientSecret){
            var data = btoa(clientId + ':' + clientSecret);
            return 'Basic ' + data;
        }

        function getAuthorizationHeader(){
            var deferred = $q.defer();
            $http.get('credentials/auth_server_client.json').then(function(response){
                var header = makeAuthorizationHeader(
                    response.data['auth.server.clientId'],
                    response.data['auth.server.clientSecret']
                );
                deferred.resolve(header);
            }).catch(function(){
                deferred.reject();
            });
            return deferred.promise;
        }

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
            getAuthorizationHeader().then(function(AuthHeader) {
                $http({
                    method: 'POST',
                    url: AuthURL('/api/oauth/token?grant_type=password'),
                    data: 'username=' + username + '&password=' + password,
                    headers: {
                        'Authorization': AuthHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data) {
                    AuthorizationService.setAccessToken(data.access_token);
                    getUserInfo(data.referenceDataUserId).then(function() {
                        getUserRights(data.referenceDataUserId).then(function() {
                            if ($state.is('auth.login.form')) {
                                $rootScope.$emit('auth.login');
                            } else {
                                $rootScope.$emit('auth.login-modal');
                            }
                            deferred.resolve();
                        }).catch(function(){
                            AuthorizationService.clearAccessToken();
                            deferred.reject();
                        });
                    }).catch(function(){
                        AuthorizationService.clearAccessToken();
                        deferred.reject();
                    });

                }).error(function() {
                    deferred.reject();
                });
            }).catch(function(){
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
            }).catch(function(){
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
                }).success(function(data) {
                    AuthorizationService.setUser(userId, data.username);
                    getUserRights(userId);
                    deferred.resolve();
                }).error(function() {
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
                }).success(function(data) {
                    AuthorizationService.setRights(Right.buildRights(data));
                    deferred.resolve();
                }).error(function() {
                    deferred.reject();
                });
            }
            return deferred.promise;
        }

        return service;
    }

})();
