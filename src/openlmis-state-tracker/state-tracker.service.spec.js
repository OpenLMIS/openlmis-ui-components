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
describe('this.stateTrackerService', function() {

    var offlineServiceMock;

    beforeEach(function() {
        var context = this;
        module('openlmis-state-tracker', function($provide) {
            context.stateStorage = jasmine.createSpyObj('stateStorage', ['put', 'clearAll', 'getAll']);
            $provide.factory('localStorageFactory', function() {
                return function() {
                    return context.stateStorage;
                };
            });

            offlineServiceMock = jasmine.createSpyObj('offlineService', ['isOffline']);
            $provide.service('offlineService', function() {
                return offlineServiceMock;
            });
        });

        inject(function($injector) {
            this.stateTrackerService = $injector.get('stateTrackerService');
            this.$state = $injector.get('$state');
        });

        this.previousState = {
            name: 'stateOne'
        };
        this.previousStateParams = {
            param: 'one',
            paramTwo: 'two'
        };

        spyOn(this.$state, 'go');
        spyOn(this.$state, 'reload');
    });

    describe('setPreviousState', function() {

        it('should set this.previousState and this.previousStateParams', function() {
            this.stateTrackerService.setPreviousState(this.previousState, this.previousStateParams);

            expect(this.stateStorage.clearAll).toHaveBeenCalled();
            expect(this.stateStorage.put).toHaveBeenCalledWith({
                previousState: this.previousState.name,
                previousStateParams: this.previousStateParams
            });
        });

        it('should not store nonTrackable state', function() {
            this.stateTrackerService.setPreviousState({
                name: 'NonTrackableState',
                nonTrackable: true
            }, {});

            expect(this.stateStorage.clearAll).not.toHaveBeenCalled();
            expect(this.stateStorage.put).not.toHaveBeenCalled();
        });

    });

    describe('goToPreviousState', function() {

        it('should restore the state', function() {
            this.stateStorage.getAll.andReturn([
                {
                    previousState: this.previousState.name,
                    previousStateParams: this.previousStateParams
                }
            ]);

            this.stateTrackerService.goToPreviousState();

            expect(this.$state.go).toHaveBeenCalledWith(this.previousState.name, this.previousStateParams, {
                reload: true
            });
        });

        it('should restore the state if default one is present and previous is stored', function() {
            this.stateStorage.getAll.andReturn([
                {
                    previousState: this.previousState.name,
                    previousStateParams: this.previousStateParams
                }
            ]);

            this.stateTrackerService.goToPreviousState('some.state');

            expect(this.$state.go).toHaveBeenCalledWith(this.previousState.name, this.previousStateParams, {
                reload: true
            });
        });

        it('should call default state', function() {
            this.stateStorage.getAll.andReturn([]);

            this.stateTrackerService.goToPreviousState('some.state');

            expect(this.$state.go).toHaveBeenCalledWith('some.state');
        });

        it('should reload current state', function() {
            this.stateStorage.getAll.andReturn([]);

            this.stateTrackerService.goToPreviousState();

            expect(this.$state.reload).toHaveBeenCalled();
        });

        it('should override stored state parameters if they were given', function() {
            this.stateStorage.getAll.andReturn([
                {
                    previousState: this.previousState.name,
                    previousStateParams: this.previousStateParams
                }
            ]);

            this.stateTrackerService.goToPreviousState('state', {
                param: 'three'
            });

            expect(this.$state.go).toHaveBeenCalledWith(this.previousState.name, {
                param: 'three',
                paramTwo: 'two'
            }, {
                reload: true
            });
        });

        it('should pass stateOptions', function() {
            this.stateStorage.getAll.andReturn([
                {
                    previousState: this.previousState.name,
                    previousStateParams: this.previousStateParams
                }
            ]);

            this.stateTrackerService.goToPreviousState('state', null, {
                someOption: false
            });

            expect(this.$state.go).toHaveBeenCalledWith(this.previousState.name, this.previousStateParams, {
                reload: true,
                someOption: false
            });
        });

        it('should not override given reload option', function() {
            this.stateStorage.getAll.andReturn([
                {
                    previousState: this.previousState.name,
                    previousStateParams: this.previousStateParams
                }
            ]);

            this.stateTrackerService.goToPreviousState('state', null, {
                reload: false
            });

            expect(this.$state.go).toHaveBeenCalledWith(this.previousState.name, this.previousStateParams, {
                reload: false
            });
        });

        it('should not reload state if offline', function() {
            this.stateStorage.getAll.andReturn([{
                previousState: this.previousState.name,
                previousStateParams: this.previousStateParams
            }]);

            offlineServiceMock.isOffline.andReturn(true);

            this.stateTrackerService.goToPreviousState('state', null);

            expect(this.$state.go).toHaveBeenCalledWith(this.previousState.name, this.previousStateParams, {
                reload: false
            });
        });
    });
});
