(function() {

    'use strict';

    angular
        .module('openlmis-auth')
        .run(run);

    run.$inject = ['$rootScope', 'authStateRouter', 'authorizationService'];

    function run($rootScope, authStateRouter, authorizationService) {
        authStateRouter.initialize();

        $rootScope.$watch(function(){
            return authorizationService.isAuthenticated();
        }, function(auth){
            $rootScope.userIsAuthenticated = auth;
        });
    }

})();
