(function() {
	
	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('requisitions.approvalList', {
			url: '/approvalList',
			controller: 'ApprovalListCtrl',
			templateUrl: 'requisitions/approval-list/approval-list.html',
			resolve: {
		        requisitionList: function ($http, RequisitionURL) {
		        	var deferred = $q.defer();

		        	$http.get(RequisitionURL('/api/requisitions/requisitions-for-approval'))
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