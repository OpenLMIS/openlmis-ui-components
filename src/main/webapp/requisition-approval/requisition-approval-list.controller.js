(function() {

	'use strict';

    /**
     * @ngdoc controller
     * @name openlmis.requisitions.RequisitionApprovalListController
     *
     * @description
     * Controller for approval list of requisitions.
     */

	angular
		.module('openlmis.requisitions')
		.controller('RequistitionApprovalCtrl', ApprovalListCtrl);

	ApprovalListCtrl.$inject = ['$state', 'requisitionList'];

	function ApprovalListCtrl($state, requisitionList) {

		var vm = this;

		vm.filterRequisitions = filterRequisitions;
		vm.openRnr = openRnr;

        /**
         * @ngdoc property
         * @name requisitions
         * @propertyOf openlmis.requisitions.RequisitionApprovalListController
         * @type {Array}
         *
         * @description
         * Holds requisitions.
         */
		vm.requisitions = requisitionList;

        /**
         * @ngdoc property
         * @name filteredRequisitions
         * @propertyOf openlmis.requisitions.RequisitionApprovalListController
         * @type {Array}
         *
         * @description
         * Holds currently filtered requisitions.
         */
		vm.filteredRequisitions = vm.requisitions;

        /**
         * @ngdoc property
         * @name openRnr
         * @propertyOf openlmis.requisitions.RequisitionApprovalListController
         *
         * @description
         * Holds handler which redirects to requisition page after clicking on grid row.
         *
         */
		function openRnr(requisitionId) {
			$state.go('requisitions.requisition.fullSupply', {
				rnr: requisitionId
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
		function filterRequisitions() {
			vm.filteredRequisitions = [];
			var query = vm.query || "";
			var searchField = vm.searchField.item.value;

			vm.filteredRequisitions = vm.requisitions.filter(function (rnr) {
                if(searchField){
                    return contains(getFieldValue(rnr, searchField), query);
                } else {
                    return matchesAnyField(query, rnr);
                }
			});

			vm.resultCount = vm.filteredRequisitions.length;
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
