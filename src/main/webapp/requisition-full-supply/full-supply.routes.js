(function() {

    'use strict';

    angular
        .module('requisition-full-supply')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider.state('requisitions.requisition.fullSupply', {
            url: '/fullSupply/:page',
            templateUrl: 'requisition-full-supply/full-supply.html',
            controller: 'FullSupplyController',
            controllerAs: 'vm',
            isOffline: true,
            resolve: {
                lineItems: function($filter, requisition) {
                    return $filter('filter')(requisition.requisitionLineItems, {
                        $program: {
                            fullSupply:true
                        }
                    });
                },
                columns: function(requisition) {
                    return requisition.template.getColumns();
                }
            }
        });
    }

})();
