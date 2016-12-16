(function() {

    'use strict';

    angular.module('openlmis.requisitions').config(config);

    config.$inject = ['$stateProvider', 'RequisitionRights'];
    function config($stateProvider, RequisitionRights) {

        $stateProvider.state('requisitions', {
            abstract: true,
            showInNavigation: true,
            priority: 1,
            label: 'link.requisitions',
            url: '/requisitions',
            template: '<div ui-view></div>'
        });

        $stateProvider.state('requisitions.initRnr', {
            url: '/initialize',
            showInNavigation: true,
            priority: 11,
            label: 'link.requisitions.create.authorize',
            controller: 'InitiateRnrController',
            controllerAs: 'vm',
            templateUrl: 'requisitions/init.html',
            accessRights: [RequisitionRights.REQUISITION_CREATE,
                RequisitionRights.REQUISITION_DELETE,
                RequisitionRights.REQUISITION_AUTHORIZE],
            resolve: {
                facility: function (AuthorizationService, $q) {
                    var deferred = $q.defer();

                    AuthorizationService.getDetailedUser().$promise.then(function(response) {
                        deferred.resolve(response.homeFacility);
                    }, function(response) {
                        deferred.reject();
                    });

                    return deferred.promise;
                },
                user: function(AuthorizationService) {
                    return AuthorizationService.getUser();
                },
                supervisedPrograms: function (UserPrograms, $q, user) {
                    var deferred = $q.defer();

                    UserPrograms(user.user_id, false).then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject();
                    });

                    return deferred.promise;
                },
                homePrograms: function (UserPrograms, $q, user) {
                    var deferred = $q.defer();

                    UserPrograms(user.user_id, true).then(function (response) {
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
