(function() {

    'use strict';

    angular
        .module('report')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('reports', {
            abstract: true,
            url: '/reports',
            showInNavigation: true,
            priority: 1,
            label: 'link.reports',
            template: '<div ui-view></div>'
        });
    }

})();
