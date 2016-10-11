(function() {

  'use strict';

  angular.module('openlmis.requisitions')
    .controller('ApprovalListCtrl', ApprovalListCtrl);

  ApprovalListCtrl.$inject = ['$scope', 'requisitionList', '$location', 'messageService'];

  function ApprovalListCtrl($scope, requisitionList, $location, messageService) {
    $scope.requisitions = requisitionList;
    $scope.filteredRequisitions = $scope.requisitions;
    $scope.selectedItems = [];

    $scope.gridOptions = { data: 'filteredRequisitions',
      showFooter: false,
      showSelectionCheckbox: false,
      enableColumnResize: true,
      showColumnMenu: false,
      sortInfo: { fields: ['submittedDate'], directions: ['asc'] },
      showFilter: false,
      rowTemplate: '<div ng-mouseover="rowStyle={\'background-color\': \'red\'}; grid.appScope.onRowHover(this);" ng-mouseleave="rowStyle={}"><div ng-click="grid.appScope.openRnr(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="col.colIndex()" ui-grid-cell></div></div>',
      columnDefs: [
        {field: 'program.name', displayName: messageService.get("program.header") },
        {field: 'facility.code', displayName: messageService.get("option.value.facility.code")},
        {field: 'facility.name', displayName: messageService.get("option.value.facility.name")},
        {field: 'facility.type', displayName: messageService.get("option.value.facility.type")},
        /*{field: 'districtName', displayName: messageService.get("option.value.facility.district")},*/
        {field: 'processingPeriod.startDate', displayName: messageService.get("label.period.start.date")},
        {field: 'processingPeriod.endDate', displayName: messageService.get("label.period.end.date")},
        {field: 'createdDate', displayName: messageService.get("label.date.submitted")},
        /*{field: 'stringModifiedDate', displayName: messageService.get("label.date.modified")},*/
        {name: 'emergency', displayName: messageService.get("requisition.type.emergency"),
          cellTemplate: '<div class="ngCellText checked"><i ng-class="{\'icon-ok\': row.entity.emergency}"></i></div>',
          width: 110 }
      ]
    };

    $scope.openRnr = function (row) {
      alert(row.entity.facilityId);
      $scope.$parent.period = {'startDate': $scope.selectedItems[0].periodStartDate, 'endDate': $scope.selectedItems[0].periodEndDate};
      $location.url("rnr-for-approval/" + $scope.selectedItems[0].id + '/' + $scope.selectedItems[0].programId + '?supplyType=fullSupply&page=1');
    };

    $scope.filterRequisitions = function () {
      $scope.filteredRequisitions = [];
      var query = $scope.query || "";
      var searchField = $scope.searchField;

      $scope.filteredRequisitions = $.grep($scope.requisitions, function (rnr) {
        return (searchField) ? contains(getFieldValue(rnr,searchField), query) : matchesAnyField(query, rnr);
      });

      $scope.resultCount = $scope.filteredRequisitions.length;
    };

    function getFieldValue(object, fieldName) {
      return fieldName.split('.').reduce(function(a, b) {
        return a[b];
      }, object);
    }

    function contains(string, query) {
      return string.toLowerCase().indexOf(query.toLowerCase()) != -1;
    }

    function matchesAnyField(query, rnr) {
      var rnrString = "|" + rnr.program.name + "|" + rnr.facility.name + "|" + rnr.facility.code + "|";
      return contains(rnrString, query);
    }
  }

})();