(function() {

    'use strict';

    angular
        .module('order')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('orders', {
            abstract: true,
            url: '/orders',
            showInNavigation: true,
            priority: 1,
            label: 'link.orders',
            template: '<div ui-view></div>'
        });
    }

})();
