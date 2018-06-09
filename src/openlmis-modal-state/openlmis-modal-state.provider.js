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
     * @name openlmis-modal-state.modalState
     *
     * @description
     * Provider for defining states which should be displayed as modals.
     */
    angular
        .module('openlmis-modal-state')
        .provider('modalState', modalStateProvider);

    modalStateProvider.$inject = ['$stateProvider'];

    function modalStateProvider($stateProvider) {
        this.state = state;
        this.$get = [function() {}];

        /**
         * @ngdoc method
         * @methodOf openlmis-modal-state.modalState
         * @name state
         *
         * @description
         * Defines a state which should be displayed as modal. Currently the resolves from parent
         * states are not available in the controller by default. To make them available please
         * include them in the parentResolves parameter line this
         *
         * ```
         * modalStateProvider.state('some.state', {
         *     parentResolves: ['someParentResolve']
         * });
         * ```
         *
         * @param   {String}    stateName   the name of the state
         * @param   {Object}    state       the state definition
         */
        function state(stateName, state) {
            parseState(state);

            // We don't want the state to open any page, we leave that to the modal service.
            delete state.controller;
            delete state.controllerAs;
            delete state.templateUrl;
            delete state.views;

            $stateProvider.state(stateName, state);
        }

        function parseState(state) {
            var dialog,
                injects = getInjects(state)
                    .concat(state.parentResolves),
                modalDefinition = {
                    controllerAs: state.controllerAs ? state.controllerAs : 'vm',
                    controller: state.controller,
                    templateUrl: state.templateUrl,
                    resolve: {}
                };

            state.onEnter = onEnter;
            state.onExit = onExit;

            onEnter.$inject = ['openlmisModalService'].concat(injects);
            function onEnter(openlmisModalService) {
                var modal = angular.copy(modalDefinition),
                    onEnterArgs = arguments,
                    counter = 1,
                    nameIdMap = {};

                angular.forEach(injects, function(name) {
                    nameIdMap[name] = counter++;
                    modal.resolve[name] = function() {
                        return onEnterArgs[nameIdMap[name]];
                    };
                });

                dialog = openlmisModalService.createDialog(modal);
            }

            function onExit() {
                dialog.hide();
                dialog = undefined;
            }
        }

        function getInjects(state) {
            var injects = [];

            angular.forEach(state.resolve, function(resolve, name) {
                injects.push(name);
            });

            return injects;
        }
    }

})();
