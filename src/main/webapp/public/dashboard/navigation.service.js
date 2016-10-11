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

  angular.module('openlmis-dashboard')
    .service('NavigationService', NavigationService);

  NavigationService.$inject = ['$state', 'AuthorizationService'];
  function NavigationService($state, AuthorizationService){
    
    var service = this;
    var navigationStates = {};
    var topLevelStates = [];

    service.get = getNavigationFor;
    service.getMain = getMainNavigation;

    parseNaviationStates($state.get());

    function parseNaviationStates(states){
      states.forEach(function(state){
        if(state.showInNavigation){
          navigationStates[state.name] = state;
        }
      });

      topLevelStates = [];
      angular.forEach(navigationStates, function(state){
        var parentStateName = getParentStateName(state.name);
        if(parentStateName){
          addChildStateTo(parentStateName, state.name);
        } else {
          topLevelStates.push(state.name);
        }
      });
      return topLevelStates;
    }

    function getParentStateName(stateName){
      var pieces = stateName.split('.');
      if(pieces.length > 1){
        pieces.pop();
        var searchName = pieces.join('.');
        var stateNames = Object.keys(navigationStates);
        for(var i=0; i < stateNames.length; i++){
          if(stateNames[i] == searchName){
            return stateNames[i];
          }
        }
      }
      return false;
    }

    function addChildStateTo(parentStateName, stateName){
      if(navigationStates[parentStateName]){
        var children = getNavigationFor(parentStateName);
        children.push(stateName);
        navigationStates[parentStateName].children = children;
        return true;
      }
      return false;
    }

    function getNavigationFor(stateName){
        if(AuthorizationService.isAuthenticated()){
            if(!stateName){
                return topLevelStates.sort(stateSort);
            }
            if(navigationStates[stateName]){
                if(navigationStates[stateName].children 
                    && Array.isArray(navigationStates[stateName].children)){
                    var childStates = navigationStates[stateName].children
                    return childStates.sort(stateSort);
                }
            }
        }
        return [];
    }

    function getMainNavigation(){
        return getNavigationFor();
    }

    function stateSort(aKey, bKey){
        var a = navigationStates[aKey];
        var b = navigationStates[bKey];

        if(a.priority || b.priority){
            if(a.priority > b.priority || !b.priority) return -1;
            if(b.priority > a.priority || !a.priority) return 1;
        }
        if(a.name > b.name) return 1;
        if(b.name > a.name) return -1;
        return 0;
    }

    return service;
  }

})();