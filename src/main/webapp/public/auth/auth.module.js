
 (function(){
    "use strict";

    /**
    *
    * @module openlmis-auth
    *
    * @description
    * The openlmis-auth module is responsible for logging a user in and out of the OpenLMIS-UI, and managing authentication when making calls to other services.
    *
    */

    angular.module('openlmis-auth', [
        'openlmis-core',
        'openlmis-templates',
        'ui.router',
        'http-auth-interceptor'
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

    /**
     * @ngdoc function
     * @name  setIsAuthenticated
     * @memberOf openlmis-auth
     *
     * @description When user authentication changes, $rootScope.userIsAuthenticated is updated for convenience.
     * 
     */
    setRootValues.$inject = ['$rootScope', 'AuthorizationService'];
    function setRootValues($rootScope, AuthorizationService){
        $rootScope.$watch(function(){
            return AuthorizationService.isAuthenticated();
        }, function(auth){
            $rootScope.userIsAuthenticated = auth;
        });
    }

})();
