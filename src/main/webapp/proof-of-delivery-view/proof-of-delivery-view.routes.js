(function() {

    'use strict';

    angular
        .module('proof-of-delivery-view')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('orders.podView', {
            url: '^/pod/:podId',
            templateUrl: 'proof-of-delivery-view/proof-of-delivery-view.html',
            controller: 'PodViewController',
            controllerAs: 'vm',
            resolve: {
                pod: function($stateParams, podFactory) {
                    return podFactory.get($stateParams.podId);
                }
            }
        });
    }

})();
