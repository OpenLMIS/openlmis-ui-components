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

    angular
        .module('openlmis.requisitions')
        .controller('InitiateRnrController', InitiateRnrController);

    InitiateRnrController.$inject = ['$scope', 'messageService', 'facility', 'PeriodFactory', 'RequisitionService', '$state'];

    function InitiateRnrController($scope, messageService, facility, PeriodFactory, RequisitionService, $state) {

        $scope.selectedRnrType = {"name": messageService.get("requisition.type.regular"), "emergency": false};

        $scope.rnrTypes = [
            {'name': messageService.get("requisition.type.regular"), 'emergency': false},
            {'name': messageService.get("requisition.type.emergency"), 'emergency': true}
        ];

        $scope.$watch('selectedProgram.item', function() {
            loadPeriods();
        }, true);

        $scope.$watch('selectedRnrType', function() {
            loadPeriods();
        }, true);

        $scope.facilities =[];

        $scope.selectedType = 0;

        $scope.loadPeriods = loadPeriods;

        $scope.periodGridOptions = { 
            data: 'periodGridData',
            canSelectRows: false,
            displayFooter: false,
            displaySelectionCheckbox: false,
            enableColumnResize: true,
            showColumnMenu: false,
            showFilter: false,
            enableSorting: false, 
            columnDefs: [
                {field: 'name', displayName: messageService.get("label.periods")},
                {field: 'startDate', displayName: messageService.get("period.header.startDate"), type: 'date', cellFilter: 'date:\'yyyy-MM-dd\''},
                {field: 'endDate', displayName: messageService.get("period.header.endDate"), type: 'date', cellFilter: 'date:\'yyyy-MM-dd\''},
                {field: 'rnrStatus', displayName: messageService.get("label.rnr.status")},
                {name: 'proceed', displayName: '', cellTemplate: '/public/requisitions/init-rnr-button.html'}
            ]
        };

        if (facility) {
            $scope.facilityDisplayName = facility.code + '-' + facility.name;
            $scope.selectedFacilityId = facility.id;
            $scope.programs = facility.supportedPrograms;
            if (_.isEmpty($scope.programs)) {
                $scope.error = messageService.get("msg.no.program.available");
            } else if ($scope.programs.length === 1) {
                $scope.selectedProgram = $scope.programs[0];
                $scope.loadPeriods();
            }
        } else {
            $scope.facilityDisplayName = messageService.get("label.none.assigned");
            $scope.error = messageService.get("error.rnr.user.facility.not.assigned");
        }

        $scope.programOptionMessage = function () {
            return $scope.programs === undefined || _.isEmpty($scope.programs) ? messageService.get("label.none.assigned") : messageService.get("label.select.program");
        };

        function loadPeriods() {
            $scope.error = "";
            $scope.periodGridData = [];
            if (!($scope.selectedProgram && $scope.selectedProgram.item  && $scope
            .selectedFacilityId)) {
                return;
            }
            PeriodFactory.get($scope.selectedProgram.item.id, $scope.selectedFacilityId, $scope.selectedRnrType.emergency).then
            (function(data) {
                $scope.isEmergency = $scope.selectedRnrType.emergency;
                if (data.length === 0) {
                    $scope.error = messageService.get("msg.no.period.available");
                } else {
                    $scope.periodGridData = data;
                }
            }).catch(function() {
                $scope.error = messageService.get("msg.no.period.available");
            });
        };

        $scope.initRnr = function (selectedPeriod) {
            $scope.error = "";

            if (selectedPeriod.rnrId) {
                $state.go('requisitions.requisition', {
                    rnr: selectedPeriod.rnrId 
                });
            } else {
                RequisitionService.initiate($scope.selectedFacilityId,
                    $scope.selectedProgram.item.id,
                    selectedPeriod.id,
                    false).then(
                    function (data) {
                        $state.go('requisitions.requisition', {
                            rnr: data.id
                        });
                    }, function () {
                        $scope.error = messageService.get("error.requisition.not.initiated");
                    });
            }
        };
    }
})();