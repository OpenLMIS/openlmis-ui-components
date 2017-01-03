(function() {

    'use strict';

    angular
        .module('openlmis-reset-password')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('auth.resetPassword', {
            url: '/resetPassword/:token',
            templateUrl: 'openlmis-reset-password/reset-password.html',
            controller: 'ResetPasswordCtrl',
            controllerAs: 'vm'
        });

    }

})();
