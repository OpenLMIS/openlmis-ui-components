(function() {

	'use strict';

	angular.module('openlmis.requisitions')
		.controller('ApprovalListCtrl', ApprovalListCtrl);

	ApprovalListCtrl.$inject = ['$scope', '$state', 'requisitionList', '$location', 'messageService', 'DateUtils'];

	function ApprovalListCtrl($scope, $state, requisitionList, $location, messageService, DateUtils) {

		$scope.requisitions = requisitionList;
		$scope.filteredRequisitions = $scope.requisitions;
		$scope.selectedItems = [];

	 	$scope.labels = [
			{
				value: '',
				name: messageService.get('option.value.all')
			}, {
				value: 'program.name',
				name: messageService.get('option.value.program')
			}, {
				value: 'facility.name',
				name: messageService.get('option.value.facility.name')
			}, {
				value: 'facility.code',
				name: messageService.get('option.value.facility.code')
			}
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
			rowTemplate: 'common/grid/row.html',
			columnDefs: [
				{
					field: 'program.name',
					displayName: messageService.get('program.header')
				}, {
					field: 'facility.code',
					displayName: messageService.get('option.value.facility.code')
				}, {
					field: 'facility.name',
					displayName: messageService.get('option.value.facility.name')
				}, {
					field: 'facility.type.name', 
					displayName: messageService.get('option.value.facility.type')
				}, /*{
					field: 'districtName',
					displayName: messageService.get('option.value.facility.district')
				},*/ {
					field: 'processingPeriod.startDate',
					displayName: messageService.get('label.period.start.date'),
					cellFilter: DateUtils.FILTER
				}, {
					field: 'processingPeriod.endDate',
					displayName: messageService.get('label.period.end.date'),
					cellFilter: DateUtils.FILTER
				}, {
					field: 'createdDate',
					displayName: messageService.get('label.date.submitted'),
					cellFilter: DateUtils.FILTER
				}, /*{
					field: 'stringModifiedDate',
					displayName: messageService.get('label.date.modified')
				},*/ {
					name: 'emergency',
					displayName: messageService.get('requisition.type.emergency'),
					cellTemplate: 'common/grid/emergency-cell.html',
					width: 110
				}
			]
		};

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

})();