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

  angular.module('openlmis-core')
    .service('AuthorizationService', AuthorizationService)

  var storageKeys = {
    'ACCESS_TOKEN': 'ACCESS_TOKEN',
    'USER_ID': 'USER_ID',
    'USERNAME': 'USERNAME',
    'USER_RIGHTS': 'RIGHTS'
  };

  AuthorizationService.$inject = ["$q", "localStorageService", "$injector"]
  function AuthorizationService ($q, localStorageService, $injector) {
    var service = {};

    service.isAuthenticated = isAuthenticated;

    service.getAccessToken = getAccessToken;
    service.setAccessToken = setAccessToken;
    service.clearAccessToken = clearAccessToken;

    service.preAuthorize = preAuthorize;
    service.preAuthorizeReporting = preAuthorizeReporting;
    service.hasPermission = hasPermission;

    service.getUser = getUser;
    service.setUser = setUser;
    service.clearUser = clearUser;
    service.getDetailedUser = getDetailedUser;

    service.getRights = getRights;
    service.setRights = setRights;
    service.clearRights = clearRights;

    var clientId, clientSecret;

    function getAccessToken(){
      var access_token = localStorageService.get(storageKeys.ACCESS_TOKEN);
      if(access_token){
        return access_token;
      } else {
        return false;
      }
    }

    function setAccessToken(value){
      return localStorageService.add(storageKeys.ACCESS_TOKEN, value);
    }

    function clearAccessToken(){
      return localStorageService.remove(storageKeys.ACCESS_TOKEN);
    }

    function isAuthenticated(){;
        if(getAccessToken()){
            return true;
        } else {
            return false;
        }
    }

    function getUser(){
      return {
        username: localStorageService.get(storageKeys.USERNAME),
        user_id: localStorageService.get(storageKeys.USER_ID)
      };
    }

    function getDetailedUser() {
      var user = getUser();
      return $injector.get('UserFactory').get(user.user_id);
    }

    function setUser(user_id, username){
      localStorageService.add(storageKeys.USERNAME, username);
      localStorageService.add(storageKeys.USER_ID, user_id);
    }

    function clearUser(){
      localStorageService.remove(storageKeys.USERNAME);
      localStorageService.remove(storageKeys.USER_ID);
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

    function setRights(rights){
      if(!rights) rights = defaultRights;
      var rightsJson = JSON.stringify(rights);
      localStorageService.add(storageKeys.USER_RIGHTS, rightsJson);
    }

    function clearRights(){
      localStorageService.remove(storageKeys.USER_RIGHTS); 
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
