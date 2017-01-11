(function() {

    'use strict';

    angular
        .module('requisition-initiate')
        .config(routes);

    routes.$inject = ['$stateProvider', 'REQUISITION_RIGHTS'];

    function routes($stateProvider, REQUISITION_RIGHTS) {

        $stateProvider.state('requisitions.initRnr', {
            url: '/initialize',
            showInNavigation: true,
            priority: 11,
            label: 'link.requisitions.create.authorize',
            controller: 'RequisitionInitiateController',
            controllerAs: 'vm',
            templateUrl: 'requisition-initiate/requisition-initiate.html',
            accessRights: [
                REQUISITION_RIGHTS.REQUISITION_CREATE,
                REQUISITION_RIGHTS.REQUISITION_DELETE,
                REQUISITION_RIGHTS.REQUISITION_AUTHORIZED
            ],
            resolve: {
                facility: function (authorizationService, $q) {
                    var deferred = $q.defer();

                    authorizationService.getDetailedUser().$promise.then(function(response) {
                        deferred.resolve(response.homeFacility);
                    }, function(response) {
                        deferred.reject();
                    });

                    return deferred.promise;
                },
                user: function(authorizationService) {
                    return authorizationService.getUser();
                },
                supervisedPrograms: function (useProgramsFactory, $q, user) {
                    var deferred = $q.defer();

                    useProgramsFactory(user.user_id, false).then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject();
                    });

                    return deferred.promise;
                },
                homePrograms: function (useProgramsFactory, $q, user) {
                    var deferred = $q.defer();

                    useProgramsFactory(user.user_id, true).then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject();
                    });

                    return deferred.promise;
                }
            }
        });
    }

})();
