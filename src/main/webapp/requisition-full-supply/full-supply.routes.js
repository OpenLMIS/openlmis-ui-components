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
            resolve: {
                lineItems: function($q, $filter, requisition, paginatedListFactory, $stateParams) {
                    var deferred = $q.defer(),
                        page = $stateParams.page ? parseInt($stateParams.page) : 1,
                        items = $filter('filter')(requisition.requisitionLineItems, {
                            $program: {
                                fullSupply:true
                            }
                        });

                    items = $filter('orderBy')(items, '$program.productCategoryDisplayName');

                    deferred.resolve(paginatedListFactory.getPaginatedItems(items, page));

                    return deferred.promise;
                }
            }
        });
    }

})();
