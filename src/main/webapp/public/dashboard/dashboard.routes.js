(function() {

    "use strict";

    angular.module('openlmis-dashboard').config(routes);

    routes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routes($stateProvider, $urlRouterProvider) {

        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'dashboard/home.html',
            showInNavigation: true,
            label: 'link.home'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'dashboard/profile.html',
            controller: 'UserProfileController',
            resolve: {
                user: function ($q, $stateParams, AuthorizationService) {
                    var deferred = $q.defer();

                    AuthorizationService.getDetailedUser().$promise.then(function(response) {
                        deferred.resolve(response);
                    }, function(response) {
                        deferred.reject();
                    });

                    return deferred.promise;
                }
            }
        })
        .state('404', {
            url: '/404',
            templateUrl: 'dashboard/404.html'
        });

    }

})();