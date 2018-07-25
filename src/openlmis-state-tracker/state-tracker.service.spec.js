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
describe('stateTrackerService', function() {

    var stateTrackerService, $state, stateStorage, previousState, previousStateParams, offlineServiceMock;

    beforeEach(function() {
        module('openlmis-state-tracker', function($provide) {
            stateStorage = jasmine.createSpyObj('stateStorage', ['put', 'clearAll', 'getAll']);
            $provide.factory('localStorageFactory', function() {
                return function() {
                    return stateStorage;
                };
            });

            offlineServiceMock = jasmine.createSpyObj('offlineService', ['isOffline']);
            $provide.service('offlineService', function() {
                return offlineServiceMock;
            });
        });

        inject(function($injector) {
            stateTrackerService = $injector.get('stateTrackerService');
            $state = $injector.get('$state');
        });

        previousState = {
            name: 'stateOne'
        };
        previousStateParams = {
            param: 'one',
            paramTwo: 'two'
        };

        spyOn($state, 'go');
        spyOn($state, 'reload');
    });

    describe('setPreviousState', function() {

        it('should set previousState and previousStateParams', function() {
            stateTrackerService.setPreviousState(previousState, previousStateParams);

            expect(stateStorage.clearAll).toHaveBeenCalled();
            expect(stateStorage.put).toHaveBeenCalledWith({
                previousState: previousState.name,
                previousStateParams: previousStateParams
            });
        });

        it('should not store nonTrackable state', function() {
            stateTrackerService.setPreviousState({
                name: 'NonTrackableState',
                nonTrackable: true
            }, {});

            expect(stateStorage.clearAll).not.toHaveBeenCalled();
            expect(stateStorage.put).not.toHaveBeenCalled();
        });

    });

    describe('goToPreviousState', function() {

        it('should restore the state', function() {
            stateStorage.getAll.andReturn([
                {
                    previousState: previousState.name,
                    previousStateParams: previousStateParams
                }
            ]);

            stateTrackerService.goToPreviousState();

            expect($state.go).toHaveBeenCalledWith(previousState.name, previousStateParams, {
                reload: true
            });
        });

        it('should restore the state if default one is present and previous is stored', function() {
            stateStorage.getAll.andReturn([
                {
                    previousState: previousState.name,
                    previousStateParams: previousStateParams
                }
            ]);

            stateTrackerService.goToPreviousState('some.state');

            expect($state.go).toHaveBeenCalledWith(previousState.name, previousStateParams, {
                reload: true
            });
        });

        it('should call default state', function() {
            stateStorage.getAll.andReturn([]);

            stateTrackerService.goToPreviousState('some.state');

            expect($state.go).toHaveBeenCalledWith('some.state');
        });

        it('should reload current state', function() {
            stateStorage.getAll.andReturn([]);

            stateTrackerService.goToPreviousState();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should override stored state parameters if they were given', function() {
            stateStorage.getAll.andReturn([
                {
                    previousState: previousState.name,
                    previousStateParams: previousStateParams
                }
            ]);

            stateTrackerService.goToPreviousState('state', {
                param: 'three'
            });

            expect($state.go).toHaveBeenCalledWith(previousState.name, {
                param: 'three',
                paramTwo: 'two'
            }, {
                reload: true
            });
        });

        it('should pass stateOptions', function() {
            stateStorage.getAll.andReturn([
                {
                    previousState: previousState.name,
                    previousStateParams: previousStateParams
                }
            ]);

            stateTrackerService.goToPreviousState('state', null, {
                someOption: false
            });

            expect($state.go).toHaveBeenCalledWith(previousState.name, previousStateParams, {
                reload: true,
                someOption: false
            });
        });

        it('should not override given reload option', function() {
            stateStorage.getAll.andReturn([
                {
                    previousState: previousState.name,
                    previousStateParams: previousStateParams
                }
            ]);

            stateTrackerService.goToPreviousState('state', null, {
                reload: false
            });

            expect($state.go).toHaveBeenCalledWith(previousState.name, previousStateParams, {
                reload: false
            });
        });

        it('should not reload state if offline', function() {
            stateStorage.getAll.andReturn([{
                previousState: previousState.name,
                previousStateParams: previousStateParams
            }]);

            offlineServiceMock.isOffline.andReturn(true);

            stateTrackerService.goToPreviousState('state', null);

            expect($state.go).toHaveBeenCalledWith(previousState.name, previousStateParams, {
                reload: false
            });
        });
    });
});
