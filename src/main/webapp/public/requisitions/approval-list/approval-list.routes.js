(function() {
	
	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('requisitions.approvalList', {
			showInNavigation: true,
			label: 'link.requisition.approve',
			url: '/approvalList',
			controller: 'ApprovalListCtrl',
			templateUrl: 'requisitions/approval-list/approval-list.html',
			resolve: {
		        requisitionList: function ($q, $http, RequisitionURL) {
		        	var deferred = $q.defer();

		        	$http.get(RequisitionURL('/api/requisitions/requisitionsForApproval'))
		        	  .then(function(response) {
		        	    deferred.resolve(response.data);
		        	  }, function(response) {
		        	    deferred.reject();
		        	  });

		        	return deferred.promise;
		        }
		    }
		});

	}

})();