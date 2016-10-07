(function() {

	'use strict';
	
	angular.module('openlmis.requisitions').config(config);

	config.$inject = ['$stateProvider'];
	function config($stateProvider) {

		$stateProvider.state('requisitions', {
			abstract: true,
			url: '/requisitions',
			template: '<div ui-view></div>'
		});

		$stateProvider.state('requisitions.requisition', {
        			url: '^/requisition/:rnr',
        			controller: 'RequisitionCtrl',
        			templateUrl: 'requisitions/requisition.html',
        			resolve: {
                requisition: function ($q, $http, $stateParams, OpenlmisURL) {
                  var deferred = $q.defer();

                  $http.get(OpenlmisURL('/requisition/api/requisitions/', $stateParams.rnr))
                    .then(function(response) {
                      deferred.resolve(new Rnr(response.data));
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