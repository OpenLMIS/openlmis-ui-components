(function() {

    'use strict';

    angular
        .module('requisition-non-full-supply')
        .config(routes);

    routes.$inject = ['$stateProvider', 'paginatedRouterProvider'];

    function routes($stateProvider, paginatedRouterProvider) {

        $stateProvider.state('requisitions.requisition.nonFullSupply', {
            url: '/nonFullSupply?page&size',
            templateUrl: 'requisition-non-full-supply/non-full-supply.html',
            controller: 'NonFullSupplyController',
            controllerAs: 'vm',
            isOffline: true,
            resolve: paginatedRouterProvider.resolve({
                items: function(requisition, $filter) {
                    return $filter('filter')(requisition.requisitionLineItems, {
                        $program: {
                            fullSupply: false
                        }
                    });
                },
                columns: function(requisition) {
                    return requisition.template.getColumns(true);
                }
            })
        });

    }

})();
