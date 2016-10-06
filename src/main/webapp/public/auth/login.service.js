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

    angular.module('openlmis-auth')
        .service('LoginService', LoginService);

    LoginService.$inject = ["$q", "$http", "AuthURL", "AuthorizationService"];
    function LoginService($q, $http, AuthURL, AuthorizationService){
        var service = {};

        service.login = login;
        service.logout = logout;

        function makeAuthorizationHeader(clientId, clientSecret){
          var data = btoa(clientId + ":" + clientSecret);
          return "Basic " + data;
        }

        function getAuthorizationHeader(){
          var deferred = $q.defer();
          $http.get('credentials/auth_server_client.json')
          .then(function(response){
            var header = makeAuthorizationHeader(
                response.data["auth.server.clientId"],
                response.data["auth.server.clientSecret"]
                );
            deferred.resolve(header);
          }).catch(function(){
            deferred.reject();
          });
          return deferred.promise;
        }

        function login(username, password){
            var deferred = $q.defer();
            getAuthorizationHeader().then(function(AuthHeader) {
              $http({
                  method: 'POST',
                  url: AuthURL('/oauth/token?grant_type=password'),
                  data: 'username=' + username + '&password=' + password,
                  headers: {
                    "Authorization": AuthHeader,
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
              }).success(function(data) {
                AuthorizationService.setAccessToken(data.access_token);

                getUserInfo(data.referenceDataUserId).then(function(){
                    deferred.resolve();
                }).catch(function(){
                    AuthorizationService.clearAccessToken();
                    deferred.reject();
                });
              }).error(function(data) {
                  deferred.reject();
              });
            }).catch(function(){
              deferred.reject();
            });
            return deferred.promise;
        }

        function logout(){
          var deferred = $q.defer();
          $http({
            method: 'POST',
            url: AuthURL('/api/users/logout')
          }).then(function(data) {

            AuthorizationService.clearAccessToken();
            AuthorizationService.clearUser();
            AuthorizationService.clearRights();

            deferred.resolve();
          }).catch(function(data){
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
                    '/api/users/search/findOneByReferenceDataUserId?referenceDataUserId='
                    + userId
                    );
                $http({
                    method: 'GET',
                    url: userInfoURL,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function(data) {
                    AuthorizationService.setUser(userId, data.username);
                    AuthorizationService.setRights(data.rights);

                    deferred.resolve();
                }).error(function(data) {
                    deferred.reject();    
                });
            }
            return deferred.promise;
        }

        return service;
    }

})();