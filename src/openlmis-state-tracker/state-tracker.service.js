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
(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-state-tracker.stateTrackerService
     *
     * @description
     * Provides method for going back to the previous state.
     */
    angular
        .module('openlmis-state-tracker')
        .service('stateTrackerService', service);

    service.$inject = ['$state', 'localStorageFactory'];

    function service($state, localStorageFactory) {

        var stateStorage = localStorageFactory('stateStorage');

        this.setPreviousState = setPreviousState;
        this.goToPreviousState = goToPreviousState;

        /**
         * @ngdoc method
         * @methodOf openlmis-state-tracker.stateTrackerService
         * @name setPreviousState
         *
         * @description
         * Stores the previous state.
         *
         * @param   {Object}    previousState       the previous state
         * @param   {Object}    previousStateParams the previous state parameters
         */
        function setPreviousState(previousState, previousStateParams) {
            if(!previousState.nonTrackable && previousState.name) {
                stateStorage.clearAll();
                stateStorage.put({
                    previousState: previousState.name,
                    previousStateParams: previousStateParams
                });
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-state-tracker.stateTrackerService
         * @name goToPreviousState
         *
         * @description
         * Restores the previous state. If there is no previous state stored, user will be redirected to default state passed as parameter.
         * If default state was not defined current state will be reloaded.
         *
         * @param {String} defaultState (optional) state that user will be redirected to if there is no previous state stored
         */
        function goToPreviousState(defaultState) {
            var storedStates = stateStorage.getAll();
            if(storedStates && storedStates.length > 0) {
                $state.go(storedStates[0].previousState, storedStates[0].previousStateParams);
            } else if(defaultState) {
                $state.go(defaultState);
            } else {
                $state.reload();
            }
        }
    }

})();
