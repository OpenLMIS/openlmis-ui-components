(function(){
    'use strict';

    angular.module('openlmis-auth')
    .run(setRootValues);

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