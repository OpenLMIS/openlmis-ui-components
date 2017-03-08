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

describe('navigationStateService', function() {

    var service, states, $state, authorizationService;

    beforeEach(function() {
        module('openlmis-navigation');

        $state = jasmine.createSpyObj('$state', ['get']);
        authorizationService = jasmine.createSpyObj('authorizationService', ['hasRights']);

        module(function($provide) {
            $provide.factory('$state', function() {
                return $state;
            });
            $provide.factory('authorizationService', function() {
                return authorizationService;
            });
        });

        states = [
            createState('', false),
            createState('state2.subState4', true, 5, false, 'rights'),
            createState('state4', true, 1),
            createState('state2', true, 2, true),
            createState('state2.subState3', true, 43, false, 'rights', true),
            createState('state1', true, 0, true),
            createState('state3', false),
            createState('state3.subState16', true, 0),
            createState('state3.subState1', true, 1),
            createState('state2.subState0', false),
            createState('state1.subState13', false),
            createState('state1.subState65', false),
            createState('state2.subState4.subSubState1', true)
        ];

        $state.get.andCallFake(function(stateName){
            if(!stateName){
                return states;
            } else {
                var foundState = false;
                angular.forEach(states, function(state){
                    if(state.name == stateName){
                        foundState = state;
                    }
                });
                return foundState;
            }
        });

        inject(function(navigationStateService) {
            service = navigationStateService;
        });
    });

    describe('initialization', function() {

        it('should group by invisible root states', function() {
            expect(service.roots['']).not.toBeUndefined();
            expect(service.roots[''].length).toBe(3);
            expect(service.roots['state3']).not.toBeUndefined();
            expect(service.roots['state3'].length).toBe(2);
        });

        it('should add only visible children to parent state', function() {
            expect(service.roots[''][0].children).not.toBeUndefined();
            expect(service.roots[''][0].children.length).toBe(2);
        });

        it('should sort children by priority', function() {
            expect(service.roots[''][0].children[0]).toBe(states[4]);
            expect(service.roots[''][0].children[1]).toBe(states[1]);
        });

        it('should sort states by priority', function() {
            expect(service.roots[''][0]).toBe(states[3]);
            expect(service.roots[''][1]).toBe(states[2]);
            expect(service.roots[''][2]).toBe(states[5]);
        });

    });

    describe('shouldDisplay', function() {

        it('should return false if state should not be shown in navigation', function() {
            expect(service.shouldDisplay(states[6])).toBe(false);
        });

        it('should return true if state does not require any rights', function() {
            expect(service.shouldDisplay(states[2])).toBe(true);
        });

        it('should return true if user has required rights', function() {
            authorizationService.hasRights.andReturn(true);
            expect(service.shouldDisplay(states[1])).toBe(true);
        });

        it('should return false if used does not have required rights', function() {
            authorizationService.hasRights.andReturn(false);
            expect(service.shouldDisplay(states[4])).not.toBe(true);
        });

        it('should return false if state is abstract and has no visible children', function() {
            expect(service.shouldDisplay(states[5])).toBe(false);
        });

        it('should return true if state is abstract but has visible children', function() {
            authorizationService.hasRights.andReturn(true);
            expect(service.shouldDisplay(states[3])).toBe(true);
        });

    });

    describe('hasChildren', function() {

        it('should return true if state has visible children', function() {
            authorizationService.hasRights.andReturn(true);
            expect(service.hasChildren(states[3])).toBe(true);
        });

        it('should return false if state is abstract and does not have visible children', function() {
            expect(service.hasChildren(states[5])).toBe(false);
        });

    });

    describe('isSubmenu', function() {

        it('should return false if state is child of root', function() {
            expect(service.isSubmenu(states[3])).toBe(false);
        });

        it('should return true if state is not child of root and has children', function() {
            expect(service.isSubmenu(states[1])).toBe(true);
        });

        it('should return false if state is not child of root and has no children', function() {
            expect(service.isSubmenu(states[4])).toBe(false);
        });

    });

    describe('isOffline', function(){
        it('should return true if the state has isOffline defined', function(){
            var offlineState = $state.get('state2.subState3');
            var state = $state.get('state2.subState0');

            expect(service.isOffline(state)).toBe(false);
            expect(service.isOffline(offlineState)).toBe(true);
        });
    });

    function createState(name, showInNavigation, priority, abstract, rights, offline) {
        return {
            name: name,
            showInNavigation: showInNavigation,
            priority: priority,
            abstract: abstract,
            accessRights: rights,
            isOffline: offline
        };
    }

});
