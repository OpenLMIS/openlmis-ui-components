(function() {

    "use strict";

    angular.module('openlmis-dashboard').config(routes);

    routes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routes($stateProvider, $urlRouterProvider) {

        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'dashboard/home.html',
            priority: 2,
            showInNavigation: true,
            label: 'link.home'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'dashboard/profile.html',
            controller: 'UserProfileController',
            resolve: {
                user: function (AuthorizationService) {
                    return AuthorizationService.getDetailedUser().$promise
                }
            }
        })
        .state('404', {
            url: '/404',
            templateUrl: 'dashboard/404.html'
        });

    }

})();
