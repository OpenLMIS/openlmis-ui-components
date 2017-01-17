(function() {

    'use strict';

    angular
        .module('order-pod-view')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('orders.podView', {
            url: '^/pod/:podId',
            templateUrl: 'order-pod-view/pod-view.html',
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
