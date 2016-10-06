(function() {

	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('requisitions.requisition', {
			url: '^/requisition/:rnr',
			controller: 'ViewRequisitionCtrl',
			templateUrl: 'requisitions/view-requisition/view-requisition.html',
			resolve: {
        requisition: function ($q, $http, $stateParams, OpenlmisURL) {
          var deferred = $q.defer();

          $http.get(OpenlmisURL('/requisition/api/requisitions/', $stateParams.rnr))
            .then(function(response) {
              deferred.resolve(response);
            }, function(response) {
              alert('Cannot find requisition with UUID: ' + $stateParams.rnr);
              deferred.reject();
            });

          return deferred.promise;
        }
		  }
		});

	}

})();
