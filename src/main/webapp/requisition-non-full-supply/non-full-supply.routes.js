(function() {

    'use strict';

    angular
        .module('requisition-non-full-supply')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('requisitions.requisition.nonFullSupply', {
            url: '/nonFullSupply/:page',
            templateUrl: 'requisition-non-full-supply/non-full-supply.html',
            controller: 'NonFullSupplyController',
            controllerAs: 'vm',
            resolve: {
                lineItems: function($q, $filter, requisition, paginatedListFactory, $stateParams) {
                    var deferred = $q.defer(),
                        page = $stateParams.page ? parseInt($stateParams.page) : 1,
                        items = $filter('filter')(requisition.requisitionLineItems, {
                            $program: {
                                fullSupply:false
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
