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
    .service('AuthorizationService', AuthorizationService)

  var storageKeys = {
    'ACCESS_TOKEN': 'ACCESS_TOKEN',
    'USER_ID': 'USER_ID',
    'USERNAME': 'USERNAME',
    'USER_RIGHTS': 'RIGHTS'
  };

  AuthorizationService.$inject = ["$q", "$http", "AuthURL", "localStorageService"]
  function AuthorizationService ($q, $http, AuthURL, localStorageService) {
    var service = {};

    service.getAccessToken = getAccessToken;
    service.isAuthenticated = isAuthenticated;
    service.login = login;
    service.logout = logout;

    service.preAuthorize = preAuthorize;
    service.preAuthorizeReporting = preAuthorizeReporting;
    service.hasPermission = hasPermission;

    service.getUser = getUser;
    service.getUserInfo = getUserInfo;

    var clientId, clientSecret;

    function getAccessToken(){
      var access_token = localStorageService.get(storageKeys.ACCESS_TOKEN);
      if(access_token){
        return access_token;
      } else {
        return false;
      }
    }

    function isAuthenticated(){;
        if(getAccessToken()){
            return true;
        } else {
            return false;
        }
    }

    function makeAuthorizationHeader(){
      var data = btoa(clientId + ":" + clientSecret);
      return "Basic " + data;
    }

    function getAuthorizationHeader(){
      if(clientId && clientSecret) return $q.when(makeAuthorizationHeader());
      
      var deferred = $q.defer();
      $http.get('/public/credentials/auth_server_client.json')
      .then(function(response){
        clientId = response.data["auth.server.clientId"];
        clientSecret = response.data["auth.server.clientSecret"];
        deferred.resolve(makeAuthorizationHeader());
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
              localStorageService.add(storageKeys.ACCESS_TOKEN, data.access_token);
              localStorageService.add(storageKeys.USER_ID, data.referenceDataUserId);
              
              deferred.resolve();
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
        url: AuthURL('/api/users/logout?access_token=' + getAccessToken())
      }).then(function(data) {

        localStorageService.remove(storageKeys.USER_RIGHTS);
        localStorageService.remove(storageKeys.USERNAME);
        localStorageService.remove(storageKeys.USER_ID);
        localStorageService.remove(storageKeys.ACCESS_TOKEN);

        deferred.resolve();
      }).catch(function(data){
        deferred.reject();
      });
      return deferred.promise;
    }

    function getUserInfo(){
        var deferred = $q.defer();

        if(!isAuthenticated()) {
            deferred.reject();
        } else {
            var userInfoURL = AuthURL('/api/users/search/findOneByReferenceDataUserId?referenceDataUserId=' +
                localStorageService.get(storageKeys.USER_ID) + '&access_token=' +
                localStorageService.get(storageKeys.ACCESS_TOKEN));

            $http({
                method: 'GET',
                url: userInfoURL,
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function(data) {
                localStorageService.add(storageKeys.USERNAME, data.username);

                //TODO: Get user's rights. For now they are hardcoded.
                //localStorageService.add(localStorageKeys.RIGHT, getRights(data.rights));
                var rights = defaultRights;
                var rightsJson = JSON.stringify(rights);
                localStorageService.add(storageKeys.USER_RIGHTS, rightsJson);

                deferred.resolve();

            }).error(function(data) {
                deferred.reject();    
            });
        }
        return deferred.promise;
    }

    function getUser(){
      return {
        username: localStorageService.get(storageKeys.USERNAME),
        user_id: localStorageService.get(storageKeys.USER_ID)
      };
    }

    function getRights(){
      var rights = false;
      try{
        var raw = localStorageService.get(storageKeys.USER_RIGHTS);
        rights = JSON.parse(raw);
      } catch (e) {
        rights = [];
      }
      return rights;
    }

    function hasRight(permissions){
      var rights = getRights();
      var rightNames = _.pluck(rights, 'name');
      var hasRight = _.intersection(permissions, rightNames);
      
      if(hasRight.length > 0){
        return true;
      } else {
        return false;
      }
    };

    function preAuthorize() {
      var permissions = Array.prototype.slice.call(arguments);
      if(!hasRight(permissions)){
        return false;
      }
      return true;
    };

    function preAuthorizeReporting() {
      return rights && _.find(JSON.parse(rights), function (right) {
        return right.type === 'REPORTING';
      });
    };

    function hasPermission() {
      var permissions = Array.prototype.slice.call(arguments);
      return hasRight(permissions);
    };

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
