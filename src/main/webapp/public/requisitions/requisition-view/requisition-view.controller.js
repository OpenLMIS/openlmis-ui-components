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

    /**
     * @ngdoc controller
     * @name openlmis-requisition.RequisitionViewController
     * @description
     * Controller for requisition view page
     */

    angular
        .module('openlmis.requisitions')
        .controller('RequisitionViewController', RequisitionViewController);

    RequisitionViewController.$inject = ['$scope', '$state', 'messageService', 'facilityList', 'RequisitionService', 'Status'];

    function RequisitionViewController($scope, $state, messageService, facilityList, RequisitionService, Status) {

        $scope.loadPrograms = loadPrograms;
        $scope.search = search;
        $scope.openRnr = openRnr;

        $scope.facilities = facilityList;
        $scope.statuses = Status.$toList();
        $scope.selectedStatuses = [];

        if (!angular.isArray($scope.facilities) || $scope.facilities.length < 1) {
            $scope.error = messageService.get('msg.facilities.not.found');
        }

        $scope.multiselectSettings = {
            smartButtonMaxItems: 4
        };

        $scope.gridOptions = { data: 'requisitionList',
            showFooter: false,
            showSelectionCheckbox: false,
            enableColumnResize: true,
            enableColumnMenus: false,
            showFilter: false,
            rowTemplate: '<div ng-click="grid.appScope.openRnr(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="col.colIndex()" ui-grid-cell></div>',
            columnDefs: [
                {field: 'program.name', displayName: messageService.get("program.header") },
                {field: 'facility.code', displayName: messageService.get("option.value.facility.code")},
                {field: 'facility.name', displayName: messageService.get("option.value.facility.name")},
                {field: 'processingPeriod.startDate', displayName: messageService.get("label.period.start.date"), type: 'date', cellFilter: 'dateFilter'},
                {field: 'processingPeriod.endDate', displayName: messageService.get("label.period.end.date"), type: 'date', cellFilter: 'dateFilter'},
                {field: 'createdDate', displayName: messageService.get("label.date.submitted"), type: 'date', cellFilter: 'dateFilter'},
                {field: 'status', displayName: messageService.get("label.status")},
                {name: 'emergency', displayName: messageService.get("requisition.type.emergency"),
                    cellTemplate: '<div class="ngCellText checked"><i ng-class="{\'icon-ok\': row.entity.emergency}"></i></div>',
                    width: 110 }
            ]
        };

        /**
         *
         * @ngdoc function
         * @name openRnr
         * @methodOf openlmis-requisition.RequisitionViewController
         * 
         * @description
         * Redirect to requisition page after clicking on grid row.
         *
         */
        function openRnr(row) {
            $state.go('requisitions.requisition', {
                rnr: row.entity.id
            });
        }

        /**
         *
         * @ngdoc function
         * @name loadPrograms
         * @methodOf openlmis-requisition.RequisitionViewController
         * 
         * @description
         * Loads selected facility supported programs to program select input.
         *
         */
        function loadPrograms() {
            if ($scope.selectedFacility.supportedPrograms) {
                $scope.programs = $scope.selectedFacility.supportedPrograms;
            } else {
                $scope.error = messageService.get('msg.no.program.available');
            }
        }

        /**
         *
         * @ngdoc function
         * @name search
         * @methodOf openlmis-requisition.RequisitionViewController
         * 
         * @description
         * Searches requisitions by criteria selected in form.
         *
         */
        function search() {
            $scope.requisitionList = [];
            $scope.error = null;
            if ($scope.selectedFacility) {
                RequisitionService.search($scope.selectedProgram ? $scope.selectedProgram.id : null, 
                    $scope.selectedFacility ? $scope.selectedFacility.id : null, 
                    getStatusLabels($scope.selectedStatuses),
                    $scope.startDate ? $scope.startDate.toISOString() : null, 
                    $scope.endDate ? $scope.endDate.toISOString() : null)
                .then(function(response) {
                    $scope.requisitionList = response;
                    if (!angular.isArray($scope.requisitionList) || $scope.requisitionList.length < 1) {
                        $scope.error = messageService.get('msg.no.requisitions.found');
                    }
                }, function() {
                    $scope.error = messageService.get('msg.error.occurred');
                });
            } else {
                $scope.error = messageService.get('msg.no.facility.selected');
            }
        }

        function getStatusLabels(ids) {
            var list;
            if(ids && angular.isArray(ids) && ids.length > 0) {
                list = [];
                angular.forEach(ids, function(id) {
                    list.push($scope.statuses[id.id].label);
                });
                return list;
            }
            return null;
        }
    }
})();