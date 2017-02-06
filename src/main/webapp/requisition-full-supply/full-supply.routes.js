(function() {

    'use strict';

    angular
        .module('requisition-full-supply')
        .config(routes);

    routes.$inject = ['$stateProvider', 'paginatedRouterProvider'];

    function routes($stateProvider, paginatedRouterProvider) {
        $stateProvider.state('requisitions.requisition.fullSupply', {
            url: '/fullSupply?page&size',
            templateUrl: 'requisition-full-supply/full-supply.html',
            controller: 'FullSupplyController',
            controllerAs: 'vm',
            isOffline: true,
            params: {
                page: '0'
            },
            resolve: paginatedRouterProvider.resolve({
                items: function($filter, requisition) {
                    return $filter('filter')(requisition.requisitionLineItems, {
                        $program: {
                            fullSupply:true
                        }
                    });
                },
                columns: function(requisition) {
                    return requisition.template.getColumns();
                }
            })
        });
    }

})();
