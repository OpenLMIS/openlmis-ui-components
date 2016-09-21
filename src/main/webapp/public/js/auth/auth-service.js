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

    angular.module('openlmis')
        .service('AuthService', AuthService);

    AuthService.$inject = ["$q", "$http", "AuthURL", "localStorageService", "authServerClientFactory"];
    function AuthService($q, $http, AuthURL, localStorageService, authServerClientFactory){
        var service = {};

        service.isAuthenticated = isAuthenticated;
        service.login = login;
        service.logout = logout;

        service.getUserInfo = getUserInfo; 

        var clientId, clientSecret;
        authServerClientFactory.getCredentials().then(function(data) {
            clientId = data["auth.server.clientId"];
            clientSecret = data["auth.server.clientSecret"];
        });

        function isAuthenticated(){
            var access_token = localStorageService.get(localStorageKeys.ACCESS_TOKEN);

            if(access_token){
                return true;
            } else {
                return false;
            }
        }

        function login(username, password){
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: AuthURL('/oauth/token?grant_type=password&username=' + username + '&password=' + password),
                headers: {
                  "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
                }
            }).success(function(data) {
                localStorageService.add(localStorageKeys.ACCESS_TOKEN, data.access_token);
                localStorageService.add(localStorageKeys.USER_ID, data.referenceDataUserId);

                deferred.resolve();
            }).error(function(data) {
                deferred.reject();
            });
            return deferred.promise;
        }

        function logout(){

        }

        function getUserInfo(){
            var deferred = $q.defer();

            if(!isAuthenticated()) {
                deferred.reject();
            } else {
                var userInfoURL = AuthURL('/api/users/search/findOneByReferenceDataUserId?referenceDataUserId=' +
                    localStorageService.get(localStorageKeys.USER_ID) + '&access_token=' +
                    localStorageService.get(localStorageKeys.ACCESS_TOKEN));

                $http({
                    method: 'GET',
                    url: userInfoURL,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function(data) {
                    localStorageService.add(localStorageKeys.USERNAME, data.username);

                    //TODO: Get user's rights. For now they are hardcoded.
                    //localStorageService.add(localStorageKeys.RIGHT, getRights(data.rights));
                    var rights = defaultRights;
                    var rightsJson = JSON.stringify(rights);
                    localStorageService.add(localStorageKeys.RIGHT, rightsJson);

                    deferred.resolve();

                }).error(function(data) {
                    deferred.reject();    
                });
            }
            return deferred.promise;
        }
        return service;
    }


    var defaultRights = [{
          "name": "DELETE_REQUISITION",
          "type": "REQUISITION"
        }, {
          "name": "MANAGE_DISTRIBUTION",
          "type": "ALLOCATION"
        }, {
          "name": "CREATE_REQUISITION",
          "type": "REQUISITION"
        }, {
          "name": "VIEW_ORDER",
          "type": "FULFILLMENT"
        }, {
          "name": "MANAGE_EQUIPMENT_INVENTORY",
          "type": "REQUISITION"
        }, {
          "name": "MANAGE_STOCK",
          "type": "REQUISITION"
        }, {
          "name": "AUTHORIZE_REQUISITION",
          "type": "REQUISITION"
        }, {
          "name": "VIEW_REQUISITION",
          "type": "REQUISITION"
        }, {
          "name": "APPROVE_REQUISITION",
          "type": "REQUISITION"
        }, {
          "name": "FACILITY_FILL_SHIPMENT",
          "type": "FULFILLMENT"
        }, {
          "name": "MANAGE_POD",
          "type": "FULFILLMENT"
        }, {
          "name": "VIEW_STOCK_ON_HAND",
          "type": "REQUISITION"
        }, {
          "name": "MANAGE_SUPERVISED_EQUIPMENTS",
          "type": "REQUISITION"
        }, {
          "name": "CONVERT_TO_ORDER",
          "type": "FULFILLMENT"
        }];

 })();