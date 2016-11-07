(function() {

  'use strict';

  angular.module('openlmis.requisitions')
    .controller('ApprovalListCtrl', ApprovalListCtrl)
    .filter('dateFilter', dateFilter);

  ApprovalListCtrl.$inject = ['$scope', '$state', 'requisitionList', '$location', 'messageService'];

  function ApprovalListCtrl($scope, $state, requisitionList, $location, messageService) {
    $scope.requisitions = requisitionList;
    $scope.filteredRequisitions = $scope.requisitions;
    $scope.selectedItems = [];


   $scope.labels = [
        {"value": "", "name": messageService.get("option.value.all")},
        {"value": messageService.get("program.name"),
            "name": messageService.get("option.value.program")},
        {"value": messageService.get("facility.name"),
            "name": messageService.get("option.value.facility.name")},
        {"value": messageService.get("facility.code"),
            "name": messageService.get("option.value.facility.code")}
    ];
 
    $scope.$watch('searchField.item', function() {
        if($scope.searchField) {
            $scope.filterRequisitions();
        }
    }, true);

    $scope.gridOptions = { data: 'filteredRequisitions',
      showFooter: false,
      showSelectionCheckbox: false,
      enableColumnResize: true,
      enableColumnMenus: false,
      sortInfo: { fields: ['submittedDate'], directions: ['asc'] },
      showFilter: false,
      rowTemplate: '<div ng-mouseover="rowStyle={\'background-color\': \'red\'}; grid.appScope.onRowHover(this);" ng-mouseleave="rowStyle={}"><div ng-click="grid.appScope.openRnr(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="col.colIndex()" ui-grid-cell></div></div>',
      columnDefs: [
        {field: 'program.name', displayName: messageService.get("program.header") },
        {field: 'facility.code', displayName: messageService.get("option.value.facility.code")},
        {field: 'facility.name', displayName: messageService.get("option.value.facility.name")},
        {field: 'facility.type.name', displayName: messageService.get("option.value.facility.type")},
        /*{field: 'districtName', displayName: messageService.get("option.value.facility.district")},*/
        {field: 'processingPeriod.startDate', displayName: messageService.get("label.period.start.date"), cellFilter: 'dateFilter'},
        {field: 'processingPeriod.endDate', displayName: messageService.get("label.period.end.date"), cellFilter: 'dateFilter'},
        {field: 'createdDate', displayName: messageService.get("label.date.submitted"), cellFilter: 'dateFilter'},
        /*{field: 'stringModifiedDate', displayName: messageService.get("label.date.modified")},*/
        {name: 'emergency', displayName: messageService.get("requisition.type.emergency"),
          cellTemplate: '<div class="ngCellText checked"><i ng-class="{\'icon-ok\': row.entity.emergency}"></i></div>',
          width: 110 }
      ]
    };

    $scope.typeOptionMessage = function() {
        return messageService.get("label.select.type");
    }

    $scope.openRnr = function (row) {
      $state.go('requisitions.requisition', {
        rnr: row.entity.id
      });
    };

    $scope.filterRequisitions = function () {
      $scope.filteredRequisitions = [];
      var query = $scope.query || "";
      var searchField = $scope.searchField.item.value;

      $scope.filteredRequisitions = $.grep($scope.requisitions, function (rnr) {
        return (searchField) ? contains(getFieldValue(rnr,searchField), query)
         : matchesAnyField(query, rnr);
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

  function formatNumber(number) {
    return number > 9 ? '' + number: '0' + number;
  }

  function dateFilter() {
    return function(value) {
        if (value) {
            return formatNumber(value[2]) + '/' + formatNumber(value[1]) + '/' + formatNumber(value[0]);      
        }
        return undefined;
    }
  }

})();