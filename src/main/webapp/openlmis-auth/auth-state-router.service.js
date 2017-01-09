(function() {

    'use strict';

    angular
        .module('openlmis-auth')
        .service('authStateRouter', router);

    router.$inject = ['$rootScope', '$state', 'authorizationService', 'alertService',
        'LoadingModalService'
    ];

    function router($rootScope, $state, authorizationService, alertService, LoadingModalService) {
        var savedToState, savedToParams;

        this.initialize = initialize;

        function initialize() {
            $rootScope.$on('$stateChangeStart', reroute);

            $rootScope.$on('auth.login', function(){
                if (savedToState) {
                    goToSavedState();
                } else {
                    $state.go('home');
                }
            });

            $rootScope.$on('event:auth-loggedIn', goToSavedState);
        }

        function reroute(event, toState, toParams, fromState, fromParams) {
            if(!authorizationService.isAuthenticated() && toState.name.indexOf('auth') != 0 && toState.name.indexOf('home') != 0){
                // if not authenticated and not on login page or home page
                event.preventDefault();
                LoadingModalService.close();
                if (fromState.name.indexOf('auth.login') !== 0) {
                    $rootScope.$emit('event:auth-loginRequired', true);
                }
                savedToState = toState.name;
                savedToParams = toParams;
            } else if(!authorizationService.isAuthenticated() &&  toState.name.indexOf('home') == 0){
                // if not authenticated and on home page
                event.preventDefault();
                $state.go('auth.login');
            } else if(authorizationService.isAuthenticated() && toState.name.indexOf('auth') == 0) {
                // if authenticated and on login page
                event.preventDefault();
                $state.go('home');
            } else if(toState.accessRights && !authorizationService.hasRights(toState.accessRights, toState.areAllRightsRequired)) {
                // checking rights to enter state
                event.preventDefault();
                alertService.error('error.authorization');
            }
        }

        function goToSavedState() {
            $state.go(savedToState, savedToParams);
            savedToState = undefined;
            savedToParams = undefined;
        }

    }

})();
