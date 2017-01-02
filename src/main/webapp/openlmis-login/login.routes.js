(function() {

    'use strict';

    angular
        .module('openlmis-login')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('auth.login', {
            url: '/login',
            templateUrl: 'openlmis-login/login-form.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        });

    }

})();
