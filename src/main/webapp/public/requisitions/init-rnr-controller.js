/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    angular.module('openlmis.requisitions').controller('InitiateRnrController', InitiateRnrController);

    InitiateRnrController.$inject = ['$scope', 'localStorageService', 'navigateBackService', 'messageService', '$timeout', 'User', 'PeriodsForProgramAndFacility', 'RequisitionsForProgramAndFacility', 'Requisition'];

    function InitiateRnrController($scope, localStorageService, navigateBackService, messageService, $timeout, User, PeriodsForProgramAndFacility, RequisitionsForProgramAndFacility, Requisition) {
        var isNavigatedBack;

        $scope.selectedRnrType = {"name": "Regular", "emergency": false}; // TODO emergency (for now always false)

        $scope.rnrTypes = {"types": [
            {"name": messageService.get("requisition.type.regular"), "emergency": false} // TODO emergency (for now always false)
        ]};

        var resetRnrData = function () {
            $scope.periodGridData = [];
            $scope.selectedProgram = null;
            $scope.selectedFacilityId = null;
            $scope.myFacility = null;
            $scope.programs = null;
            $scope.facilities = null;
            $scope.error = null;
        },
        optionMessage = function (entity, defaultMessage) {
            return entity === undefined || _.isEmpty(entity) ? messageService.get("label.none.assigned") : defaultMessage;
        },
        resetValuesForFirstPeriod = function (periodGridData) {
            var firstPeriodWithRnrStatus = periodGridData[0];
            firstPeriodWithRnrStatus.activeForRnr = true;
            if (!firstPeriodWithRnrStatus.rnrId) {
                firstPeriodWithRnrStatus.rnrStatus = messageService.get("msg.rnr.not.started");
            }
        },
        createPeriodWithRnrStatus = function (periods) {
            var periodWithRnrStatus;
            if (periods === null || periods.length === 0) {
                $scope.error = messageService.get("msg.no.period.available");
                if ($scope.isEmergency) { // TODO emergency (for now always false)
                    addPreviousRequisitionToPeriodList(rrns);
                }
                return;
            }

            $scope.periodGridData = [];

            periods.forEach(function (period) {
                periodWithRnrStatus = angular.copy(period);
                RequisitionsForProgramAndFacility.get({processingPeriod: period.id, program: $scope.selectedProgram.id, facility: $scope.selectedFacilityId},
                    function (data) {
                        var rnr;
                        data.forEach(function (requisition) {
                            if (requisition.processingPeriodId == period.id) {
                                rnr = requisition;
                            }
                        });
                        if ($scope.isEmergency) { // TODO emergency (for now always false)
                            periodWithRnrStatus.rnrStatus = messageService.get("msg.rnr.not.started");
                        }
                        else {
                            periodWithRnrStatus.rnrStatus = messageService.get("msg.rnr.previous.pending");
                            if (periodWithRnrStatus.id === rnr.processingPeriodId) {
                                periodWithRnrStatus.rnrId = rnr.id;
                                periodWithRnrStatus.rnrStatus = rnr.status;
                            }
                        }
                        $scope.periodGridData.push(periodWithRnrStatus);
                    }, function (data) {
                        periodWithRnrStatus.rnrStatus = messageService.get("msg.rnr.previous.pending");
                        $scope.periodGridData.push(periodWithRnrStatus);
                });
            });

            if ($scope.isEmergency) { // TODO emergency (for now always false)
                addPreviousRequisitionToPeriodList(rnrs);
            }
        },
        addPreviousRequisitionToPeriodList = function (rnrs) { // TODO emergency (for now always false)
            var periodWithRnrStatus;
            if (rnrs === null || rnrs.length === 0) return;
            rnrs.forEach(function (rnr) {
                if (rnr.status === 'INITIATED' || rnr.status === 'SUBMITTED') {
                    periodWithRnrStatus = angular.copy(rnr.period);
                    periodWithRnrStatus.rnrStatus = rnr.status;
                    periodWithRnrStatus.rnrId = rnr.id;
                    periodWithRnrStatus.activeForRnr = true;
                    $scope.periodGridData.push(periodWithRnrStatus);
                }
            });
        };

        $scope.$on('$viewContentLoaded', function () {
            $scope.selectedType = navigateBackService.selectedType || "0";
            $scope.selectedProgram = navigateBackService.selectedProgram;
            $scope.selectedFacilityId = navigateBackService.selectedFacilityId;
            isNavigatedBack = navigateBackService.isNavigatedBack;
            $scope.$watch('programs', function () {
                isNavigatedBack = navigateBackService.isNavigatedBack;
                if (!isNavigatedBack) $scope.selectedProgram = undefined;
                if ($scope.programs && !isUndefined($scope.selectedProgram)) {
                    $scope.selectedProgram = _.where($scope.programs, {id: $scope.selectedProgram.id})[0];
                    $scope.loadPeriods();
                }
            });
            $scope.loadFacilityData($scope.selectedType);
            if (isNavigatedBack) {

            }
            $scope.$watch('facilities', function () {
                if ($scope.facilities && isNavigatedBack) {
                    $scope.selectedFacilityId = navigateBackService.selectedFacilityId;
                    isNavigatedBack = false;
                }
            });
        });

        $scope.loadFacilityData = function (selectedType) {
            isNavigatedBack = isNavigatedBack ? selectedType !== "0" : resetRnrData();

            User.get({id: localStorageService.get(localStorageKeys.USER_ID)},
                function (data) {
                    $scope.facilities = [data.homeFacility];
                    $scope.myFacility = data.homeFacility;
                    if ($scope.myFacility) {
                        $scope.facilityDisplayName = $scope.myFacility.code + '-' + $scope.myFacility.name;
                        $scope.selectedFacilityId = $scope.myFacility.id;
                        $scope.programs = $scope.myFacility.supportedPrograms;
                    } else {
                        $scope.facilityDisplayName = messageService.get("label.none.assigned");
                        $scope.programs = null;
                        $scope.selectedProgram = null;
                    }
                }, function () {
                    $scope.error = messageService.get("msg.rnr.get.user.info.error");
            });
        };

        $scope.periodGridOptions = { 
            data: 'periodGridData',
            showFooter: false,
            showSelectionCheckbox: false,
            enableColumnResize: true,
            showColumnMenu: false,
            showFilter: false,
            rowTemplate: '<div ng-mouseover="rowStyle={\'background-color\': \'red\'}; grid.appScope.onRowHover(this);" ng-mouseleave="rowStyle={}"><div ng-click="grid.appScope.openRnr(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="col.colIndex()" ui-grid-cell></div></div>',
            columnDefs: [
                {field: 'name', displayName: messageService.get("label.periods")},
                {field: 'startDate', displayName: messageService.get("period.header.startDate")},
                {field: 'endDate', displayName: messageService.get("period.header.endDate")},
                {field: 'rnrStatus', displayName: messageService.get("label.rnr.status") },
                {name: 'proceed', displayName: '', cellTemplate: '<init-rnr-button active-for-rnr="' + 'row.entity.activeForRnr' + '"><init-rnr-button>'}
            ]
        };

        $scope.$watch("error", function (errorMsg) {
            $timeout(function () {
                if (errorMsg) {
                    document.getElementById('saveSuccessMsgDiv').scrollIntoView();
                }
            });
        });

        $scope.facilityOptionMessage = function () {
            return optionMessage($scope.facilities, messageService.get("label.select.facility"));
        };

        $scope.programOptionMessage = function () {
            return optionMessage($scope.programs, messageService.get("label.select.program"));
        };

        $scope.loadPeriods = function () {
            var periods, rnrs;
            $scope.periodGridData = [];
            if (!($scope.selectedProgram && $scope.selectedProgram.id && $scope.selectedFacilityId)) {
                $scope.error = "";
                return;
            }

            PeriodsForProgramAndFacility.get({programId: $scope.selectedProgram.id, facilityId: $scope.selectedFacilityId, emergency: false},
                function (data) {
                    $scope.error = "";
                    $scope.isEmergency = false;
                    createPeriodWithRnrStatus(data);
                }, function () {
                    if (data.data.error === 'error.current.rnr.already.post.submit') {
                        $scope.error = $scope.selectedType !== "0" ? messageService.get("msg.no.rnr.awaiting.authorization") :
                        messageService.get("msg.rnr.current.period.already.submitted");
                        return;
                    }
                    $scope.error = data.data.error;
            });
        };

        $scope.initRnr = function (selectedPeriod) {
            var data = {selectedType: $scope.selectedType, selectedProgram: $scope.selectedProgram, selectedFacilityId: $scope.selectedFacilityId, isNavigatedBack: true},
                requisition;

            navigateBackService.setData(data);
            $scope.error = "";

            if (selectedPeriod.rnrId) {
                Requisition.get({id: selectedPeriod.rnrId},
                    function (data) {
                        $scope.$parent.rnrData = data;
                        // TODO go to create Rnr
                    }, function () {
                        $scope.error = data.data.error ? data.data.error : messageService.get("error.requisition.not.exist");
                });
            } else {
                Requisition.save({facility: $scope.selectedFacilityId,
                    program: $scope.selectedProgram.id,
                    processingPeriod: selectedPeriod.id,
                    emergency: $scope.selectedRnrType.emergency},
                    function (data) {
                        $scope.$parent.rnrData = data;
                        // TODO go to create Rnr
                    }, function () {
                        $scope.error = messageService.get("error.requisition.not.initiated");
                });
            }
        };
    }
})();