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
     * @ngdoc controller
     * @name requisition-initiate.RequisitionInitiateController
     * @description
     * Controller responsible for actions connected with displaying available periods and
     * initiating or navigating to an existing requisition.
     */
    angular
        .module('requisition-initiate')
        .controller('RequisitionInitiateController', RequisitionInitiateController);

    RequisitionInitiateController.$inject = [
        'messageService', 'facility', 'user', 'supervisedPrograms', 'homePrograms', 'periodFactory',
        'requisitionService', '$state', 'dateUtils', 'REQUISITION_STATUS', 'loadingModalService',
        'notificationService', 'authorizationService', '$q', 'REQUISITION_RIGHTS',
        'facilityService', 'userRightFactory'
    ];

    function RequisitionInitiateController(messageService, facility, user, supervisedPrograms,
                                     homePrograms, periodFactory, requisitionService, $state,
                                     dateUtils, REQUISITION_STATUS, loadingModalService,
                                     notificationService, authorizationService, $q,
                                     REQUISITION_RIGHTS, facilityService, userRightFactory) {

        var vm = this;

        /**
         * @ngdoc property
         * @name emergency
         * @propertyOf requisition-initiate.RequisitionInitiateController
         * @type {Boolean}
         *
         * @description
         * Holds a boolean indicating if the currently selected requisition type is standard or emergency
         */
        vm.emergency = false;

        /**
         * @ngdoc property
         * @name facilities
         * @propertyOf requisition-initiate.RequisitionInitiateController
         * @type {Array}
         *
         * @description
         * Holds available facilities based on the selected type and/or programs
         */
        vm.facilities = [];

        /**
         * @ngdoc property
         * @name supervisedPrograms
         * @propertyOf requisition-initiate.RequisitionInitiateController
         * @type {Array}
         *
         * @description
         * Holds available programs where user has supervisory permissions.
         */
        vm.supervisedPrograms = supervisedPrograms;

        /**
         * @ngdoc property
         * @name homePrograms
         * @propertyOf requisition-initiate.RequisitionInitiateController
         * @type {Array}
         *
         * @description
         * Holds available programs for home facility.
         */
        vm.homePrograms = homePrograms;

        /**
         * @ngdoc property
         * @name isSupervised
         * @propertyOf requisition-initiate.RequisitionInitiateController
         * @type {Boolean}
         *
         * @description
         * Holds currently selected facility selection type:
         *  false - my facility
         *  true - supervised facility
         */
        vm.isSupervised = false;

        // Functions

        vm.loadPeriods = loadPeriods;

        vm.programOptionMessage = programOptionMessage;

        vm.initRnr = initRnr;

        vm.updateFacilityType = updateFacilityType;

        vm.loadFacilitiesForProgram = loadFacilitiesForProgram;

        vm.updateFacilityType(vm.isSupervised);

        /**
         * @ngdoc function
         * @name loadFacilityData
         * @methodOf requisition-initiate.RequisitionInitiateController
         *
         * @description
         * Responsible for displaying and updating select elements that allow to choose
         * program and facility to initiate or proceed with the requisition for.
         * If isSupervised is true then it will display all programs where the current
         * user has supervisory permissions. If the param is false, then list of programs
         * from user's home facility will be displayed.
         *
         * @param {Boolean} isSupervised  indicates type of facility to initiate or proceed with the requisition for
         */
        function updateFacilityType(isSupervised) {

            vm.supervisedFacilitiesDisabled = vm.supervisedPrograms.length <= 0;

            if (isSupervised) {
                vm.error = '';
                vm.programs = vm.supervisedPrograms;
                vm.facilities = [];
                vm.selectedFacilityId = undefined;
                vm.selectedProgramId = undefined;

                if (vm.programs.length === 1) {
                    vm.selectedProgramId = vm.programs[0].id;
                    loadFacilitiesForProgram(vm.programs[0].id);
                }
            } else {
                vm.error = '';
                vm.programs = vm.homePrograms;
                vm.facilities = [facility];
                vm.selectedFacilityId = facility.id;
                vm.selectedProgramId = undefined;

                if (vm.programs.length <= 0) {
                    vm.error = messageService.get('msg.no.program.available');
                } else if (vm.programs.length === 1) {
                    vm.selectedProgramId = vm.programs[0].id;
                }
            }
        }


        /**
         * @ngdoc function
         * @name programOptionMessage
         * @methodOf requisition-initiate.RequisitionInitiateController
         *
         * @description
         * Determines a proper message for the programs dropdown, based on the presence of programs.
         *
         * @return {String} localized message
         */
        function programOptionMessage() {
            return vm.programs === undefined || _.isEmpty(vm.programs) ? messageService.get('label.none.assigned') : messageService.get('label.select.program');
        }

        /**
         * @ngdoc function
         * @name loadPeriods
         * @methodOf requisition-initiate.RequisitionInitiateController
         *
         * @description
         * Responsible for displaying and updating a grid, containing available periods for the
         * selected program, facility and type. It will set an error message if no periods have
         * been found for the given parameters. It will also filter out periods for which there
         * already exists a requisition with an AUTHORIZED, APPROVED or RELEASED status.
         */
        function loadPeriods() {
            loadingModalService.open();
            periodFactory.get(vm.selectedProgramId, vm.selectedFacilityId, vm.emergency).then
            (function(data) {
                vm.periodGridData = data;
                vm.periodGridData.forEach(function (period) {
                    if (vm.emergency && (period.rnrStatus == REQUISITION_STATUS.AUTHORIZED ||
                    period.rnrStatus == REQUISITION_STATUS.APPROVED ||
                    period.rnrStatus == REQUISITION_STATUS.RELEASED)) {
                        period.rnrStatus = messageService.get('msg.rnr.not.started');
                    }
                });
                loadingModalService.close();
            }).catch(function() {
                notificationService.error('msg.error.occurred');
                loadingModalService.close();
            });
        }

        /**
         * @ngdoc function
         * @name initRnr
         * @methodOf requisition-initiate.RequisitionInitiateController
         *
         * @description
         * Responsible for initiating and/or navigating to the requisition, based on the specified
         * period. If the provided period does not have a requisition associated with it, one
         * will be initiated for the currently selected facility, program, emergency status and
         * provided period. In case of a successful response, a redirect to the newly initiated
         * requisition is made. Otherwise an error about failed requisition initiate is shown. If
         * the provided period is already associated with a requisition, the function only
         * performs a redirect to that requisition.
         *
         * @param {Object} selectedPeriod  a period to initiate or proceed with the requisition for
         */
        function initRnr(selectedPeriod) {
            vm.error = '';
            loadingModalService.open();
            if (!selectedPeriod.rnrId || selectedPeriod.rnrStatus == messageService.get('msg.rnr.not.started')) {
                userRightFactory.checkRightForCurrentUser(REQUISITION_RIGHTS.REQUISITION_CREATE, vm.selectedProgramId, vm.selectedFacilityId).then(function(response) {
                    if(response) {
                        requisitionService.initiate(vm.selectedFacilityId,
                            vm.selectedProgramId,
                            selectedPeriod.id,
                            vm.emergency)
                        .then(function (data) {
                            $state.go('requisitions.requisition.fullSupply', {
                                rnr: data.id
                            });
                        }, handleError('error.requisition.couldNotInitiate'));
                    } else {
                        handleError('error.requisition.noPermissionToInitiate')();
                    }
                }, handleError('error.requisition.noPermissionToInitiate'));
            } else {
                $state.go('requisitions.requisition.fullSupply', {
                    rnr: selectedPeriod.rnrId
                });
            }
        }
        /**
         * @ngdoc function
         * @name loadFacilitiesForProgram
         * @methodOf requisition-initiate.RequisitionInitiateController
         *
         * @description
         * Responsible for providing a list of facilities where selected program is active and
         * where the current user has supervisory permissions.
         *
         * @param {Object} selectedProgramId id of selected program where user has supervisory permissions
         */
        function loadFacilitiesForProgram(selectedProgramId) {
            if (selectedProgramId) {
                loadingModalService.open();
                var createRight = authorizationService.getRightByName(REQUISITION_RIGHTS.REQUISITION_CREATE),
                    authorizeRight = authorizationService.getRightByName(REQUISITION_RIGHTS.REQUISITION_AUTHORIZE),
                    promises = [];

                if(createRight) {
                    promises.push(facilityService.getUserSupervisedFacilities(user.user_id, selectedProgramId, createRight.id))
                }
                if(authorizeRight) {
                    promises.push(facilityService.getUserSupervisedFacilities(user.user_id, selectedProgramId, authorizeRight.id))
                }

                if(promises.length > 0) {
                    $q.all(promises).then(function (facilities) {

                        if(promises.length > 1) {
                            vm.facilities = facilities[0].concat(facilities[1]);
                        } else {
                            vm.facilities = facilities[0];
                        }

                        if (vm.facilities.length <= 0) {
                            vm.error = messageService.get('msg.no.facility.available');
                        } else {
                            vm.error = '';
                        }
                    })
                    .catch(function (error) {
                        notificationService.error('msg.error.occurred');
                        loadingModalService.close();
                    })
                    .finally(loadingModalService.close());
                } else {
                    notificationService.error('error.noActionRight');
                }
            } else {
                vm.facilities = [];
            }
        }

        function handleError(message) {
            return function() {
                loadingModalService.close();
                notificationService.error(message);
            };
        }
    }
})();
