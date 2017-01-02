(function(){
    'use strict';

    angular.module('openlmis-auth')
    .config(routes);

    routes.$inject = ['$stateProvider'];
    function routes($stateProvider){
        $stateProvider
            .state('auth', {
                abstract: true,
                templateUrl: 'openlmis-auth/auth.html'
            });
    }

})();