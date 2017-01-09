(function() {

    'use strict';

    angular
        .module('openlmis-user')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('profile', {
            url: '/profile',
            templateUrl: 'openlmis-user/profile.html',
            controller: 'UserProfileController',
            resolve: {
                user: function (authorizationService) {
                    return authorizationService.getDetailedUser().$promise
                }
            }
        });

    }

})();
