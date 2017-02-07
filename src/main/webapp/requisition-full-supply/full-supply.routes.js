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
            resolve: paginatedRouterProvider.resolve({
                items: function($filter, requisition) {
                    var fullSupplyLineItems = $filter('filter')(requisition.requisitionLineItems, {
                        $program: {
                            fullSupply:true
                        }
                    });

                    return $filter('orderBy')(
                        fullSupplyLineItems,
                        '$program.productCategoryDisplayName'
                    );
                },
                columns: function(requisition) {
                    return requisition.template.getColumns();
                }
            })
        });
    }

})();
