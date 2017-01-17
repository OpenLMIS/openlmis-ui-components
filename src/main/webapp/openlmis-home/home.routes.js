(function() {

    'use strict';

    angular
        .module('openlmis-home')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'openlmis-home/home.html',
            priority: 3,
            showInNavigation: true,
            label: 'link.home',
            isOffline: true
        });

    }

})();
