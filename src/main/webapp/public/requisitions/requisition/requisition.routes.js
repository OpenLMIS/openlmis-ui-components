(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .config(routes);

    routes.$inject = ['$stateProvider', 'RequisitionRights'];

    function routes($stateProvider, RequisitionRights) {

        $stateProvider.state('requisitions.requisition', {
            url: '^/requisition/:rnr',
            controller: 'RequisitionCtrl',
            templateUrl: 'requisitions/requisition/requisition.html',
            accessRight: [RequisitionRights.REQUISITION_CREATE, RequisitionRights.REQUISITION_DELETE, RequisitionRights.REQUISITION_AUTHORIZE, RequisitionRights.REQUISITION_APPROVE, RequisitionRights.REQUISITION_CONVERT_TO_ORDER],
            resolve: {
                requisition: function ($location, $q, $stateParams, RequisitionService) {
                    var deferred = $q.defer();

                    RequisitionService.get($stateParams.rnr).then(function(response) {
                        deferred.resolve(response);
                    }, function(response) {
                        deferred.reject();
                        return $location.url('/404');
                    });

                    return deferred.promise;
                }
            }
        });

        $stateProvider.state('requisitions.requisition.fullSupply', {
            url: '/fullSupply',
            templateUrl: 'requisitions/requisition/full-supply.html',
            controller: 'FullSupplyCtrl',
            controllerAs: 'vm'
        });

        $stateProvider.state('requisitions.requisition.nonFullSupply', {
            url: '/nonFullSupply',
            templateUrl: 'requisitions/requisition/non-full-supply.html',
            controller: 'NonFullSupplyCtrl',
            controllerAs: 'vm'
        });
    }

})();
