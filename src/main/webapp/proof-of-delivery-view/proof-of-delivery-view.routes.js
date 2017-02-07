(function() {

    'use strict';

    angular
        .module('proof-of-delivery-view')
        .config(routes);

    routes.$inject = ['$stateProvider', 'paginatedRouterProvider'];

    function routes($stateProvider, paginatedRouterProvider) {

        $stateProvider.state('orders.podView', {
            url: '^/pod/:podId?page&size',
            templateUrl: 'proof-of-delivery-view/proof-of-delivery-view.html',
            controller: 'ProofOfDeliveryViewController',
            controllerAs: 'vm',
            resolve: paginatedRouterProvider.resolve({
                pod: function($stateParams, proofOfDeliveryFactory) {
                    return proofOfDeliveryFactory.get($stateParams.podId);
                },
                items: function(pod) {
                    return pod.proofOfDeliveryLineItems;
                }
            })
        });
    }

})();
