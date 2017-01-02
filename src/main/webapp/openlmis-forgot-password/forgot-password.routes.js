(function() {

    'use strict';

    angular
        .module('openlmis-forgot-password')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('auth.forgotPassword', {
            url: '/forgotPassword',
            templateUrl: 'openlmis-forgot-password/forgot-password.html',
            controller: 'ForgotPasswordCtrl',
            controllerAs: 'vm'
        })

    }

})();
