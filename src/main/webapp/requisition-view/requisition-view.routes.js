(function() {

    'use strict';

    angular
        .module('requisition-view')
        .config(routes);

    routes.$inject = ['$stateProvider', 'RequisitionRights'];

    function routes($stateProvider, RequisitionRights) {

        $stateProvider.state('requisitions.requisition', {
            url: '^/requisition/:rnr',
            controller: 'RequisitionCtrl',
            controllerAs: 'vm',
            templateUrl: 'requisition-view/requisition-view.html',
            accessRights: [RequisitionRights.REQUISITION_CREATE,
                RequisitionRights.REQUISITION_DELETE,
                RequisitionRights.REQUISITION_AUTHORIZE,
                RequisitionRights.REQUISITION_APPROVE,
                RequisitionRights.REQUISITION_CONVERT_TO_ORDER],
            resolve: {
                requisition: function ($location, $q, $stateParams, requisitionService) {
                    var deferred = $q.defer();

                    requisitionService.get($stateParams.rnr).then(function(response) {
                        deferred.resolve(response);
                    }, function(response) {
                        deferred.reject();
                        return $location.url('/404');
                    });

                    return deferred.promise;
                }
            }
        });

    }

})();
