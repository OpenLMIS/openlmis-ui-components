(function() {

	'use strict';

    /**
     * @ngdoc controller
     * @name openlmis.requisitions.RequisitionApprovalListController
     *
     * @description
     * Controller for approval list of requisitions.
     */

	angular.module('openlmis.requisitions')
		.controller('ApprovalListCtrl', ApprovalListCtrl);

	ApprovalListCtrl.$inject = ['$scope', '$state', 'requisitionList', '$location', 'messageService', 'DateUtils'];

	function ApprovalListCtrl($scope, $state, requisitionList, $location, messageService, DateUtils) {

        /**
         * @ngdoc property
         * @name requisitions
         * @propertyOf openlmis.requisitions.RequisitionApprovalListController
         * @type {Array}
         *
         * @description
         * Holds requisitions.
         */
		$scope.requisitions = requisitionList;

        /**
         * @ngdoc property
         * @name filteredRequisitions
         * @propertyOf openlmis.requisitions.RequisitionApprovalListController
         * @type {Array}
         *
         * @description
         * Holds currently filtered requisitions.
         */
		$scope.filteredRequisitions = $scope.requisitions;

        /**
         * @ngdoc property
         * @name labels
         * @propertyOf openlmis.requisitions.RequisitionApprovalListController
         * @type {Array}
         *
         * @description
         * Holds needed labels.
         */
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

        /**
         * @ngdoc property
         * @name gridOptions
         * @propertyOf openlmis.requisitions.RequisitionApprovalListController
         *
         * @description
         * Holds configuration of the grid.
         */
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

        /**
         * @ngdoc property
         * @name openRnr
         * @propertyOf openlmis.requisitions.RequisitionApprovalListController
         *
         * @description
         * Holds handler which redirects to requisition page after clicking on grid row.
         *
         */
		$scope.openRnr = function (row) {
			$state.go('requisitions.requisition.fullSupplyProducts', {
				rnr: row.entity.id
			});
		};

        /**
         * @ngdoc property
         * @name filterRequisitions
         * @propertyOf openlmis.requisitions.RequisitionApprovalListController
         *
         * @description
         * Holds handler which filters requisitions after change query or searchField.
         *
         */
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

        /**
         * @ngdoc function
         * @name getFieldValue
         * @methodOf openlmis.requisitions.RequisitionApprovalListController
         *
         * @description
         * Get value of field from object using dot char to split it.
         *
         * @param  {Object} object    the object to get value
         * @param  {String} fieldName the name of field
         * @return {String}           value of field
         */
		function getFieldValue(object, fieldName) {
			return fieldName.split('.').reduce(function(a, b) {
				return a[b];
			}, object);
		}

        /**
         * @ngdoc function
         * @name contains
         * @methodOf openlmis.requisitions.RequisitionApprovalListController
         *
         * @description
         * Check if string contains specific substring.
         * If substring exist in string return index of first char of substring.
         *
         * @param  {String} string the string wherein search
         * @param  {String} query  the substring to search
         * @return {number}        index in string table of specific first char of substring
         */
		function contains(string, query) {
			return string.toLowerCase().indexOf(query.toLowerCase()) != -1;
		}

        /**
         * @ngdoc function
         * @name matchesAnyField
         * @methodOf openlmis.requisitions.RequisitionApprovalListController
         *
         * @description
         * Concat strings: program name, facility name and code to one string. Check if this string
         * contains specific substring. If substring exist in string return index of first char of substring.
         *
         * @param  {String} query the string to search
         * @param  {Object} rnr   the requisition to get program name facility name and code
         * @return {number}       index in string table of specific first char of substring
         */
		function matchesAnyField(query, rnr) {
			var rnrString = "|" + rnr.program.name + "|" + rnr.facility.name + "|" + rnr.facility.code + "|";
			return contains(rnrString, query);
		}
	}

})();