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

    var stateTrackerService, $state;

    beforeEach(function() {
        module('openlmis-state-tracker');

        inject(function($injector) {
            stateTrackerService = $injector.get('stateTrackerService');
            $state = $injector.get('$state');
        });
    });

    describe('setPreviousState', function() {

        var previousState, previousStateParams;

        beforeEach(function() {
            previousState = {
                name: 'stateOne'
            };

            previousStateParams = {
                param: 'one'
            };
        });

        it('should set previousState', function() {
            stateTrackerService.previousState = undefined;

            stateTrackerService.setPreviousState(previousState, previousStateParams);

            expect(stateTrackerService.previousState).toEqual(previousState);
        });

        it('should set previousStateParams', function() {
            stateTrackerService.previousStateParams = undefined;

            stateTrackerService.setPreviousState(previousState, previousStateParams);

            expect(stateTrackerService.previousStateParams).toEqual(previousStateParams);
        });

    });

    it('goToPreviousState should restore the state', function() {
        spyOn($state, 'go');
        stateTrackerService.previousState = previousState;
        stateTrackerService.previousStateParams = previousStateParams;

        stateTrackerService.goToPreviousState();

        expect($state.go).toHaveBeenCalledWith(previousState, previousStateParams);
    });

});
