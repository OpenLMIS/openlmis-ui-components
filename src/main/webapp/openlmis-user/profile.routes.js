(function() {

    'use strict';

    angular
        .module('openlmis-user')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('profile', {
            url: '/profile',
            templateUrl: 'openlmis-userprofile.html',
            controller: 'UserProfileController',
            resolve: {
                user: function (AuthorizationService) {
                    return AuthorizationService.getDetailedUser().$promise
                }
            }
        });

    }

})();
