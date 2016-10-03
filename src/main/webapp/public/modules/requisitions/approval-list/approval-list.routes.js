(function() {
	
	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('app.requisitions.approvalList', {
			url: '/requisitions/approvalList',
			controller: 'ApprovalListCtrl',
			templateUrl: 'modules/requisitions/approval-list/approval-list.html',
			resolve: {
		        requisitionList: function ($http, localStorageService, OpenlmisServerURL) {
		        	var url = OpenlmisServerURL + '/requisition/api/requisitions/requisitions-for-approval&access_token=' +
                				localStorageService.get(localStorageKeys.ACCESS_TOKEN);
		          	return $http.get(url);
		        }
		    }
		});

	}

})();