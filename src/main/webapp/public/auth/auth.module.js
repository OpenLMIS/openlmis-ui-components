
 (function(){
    "use strict";

    /**
    *
    * @module openlmis-auth
    *
    */

    angular.module('openlmis-auth', [
        'openlmis-core',
        'ui.router'
        ])
    .config(routes)
    .run(setRootValues);

    routes.$inject = ['$stateProvider', '$urlRouterProvider'];
    function routes($stateProvider, $urlRouterProvider){
        $stateProvider
        .state('auth', {
            abstract: true
        })
        .state('auth.login', {
            url: '/login',
            views:{
                '@': {
                    templateUrl: 'auth/login-form.html',
                    controller: 'LoginController'
                }
            }
        });
    }

    setRootValues.$inject = ['$rootScope', 'AuthorizationService'];
    function setRootValues($rootScope, AuthorizationService){
        $rootScope.$watch(function(){
            return AuthorizationService.isAuthenticated();
        }, function(auth){
            $rootScope.userIsAuthenticated = auth;
        });
    }

})();
