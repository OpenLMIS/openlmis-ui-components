(function() {

    'use strict';

    angular
        .module('requisition-initiate')
        .config(routes);

    routes.$inject = ['$stateProvider', 'REQUISITION_RIGHTS'];

    function routes($stateProvider, REQUISITION_RIGHTS) {

        $stateProvider.state('requisitions.initRnr', {
            url: '/initiate',
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
                facility: function(facilityFactory) {
                    return facilityFactory.getUserHomeFacility();
                },
                user: function(authorizationService) {
                    return authorizationService.getUser();
                },
                supervisedPrograms: function (programService, user) {
                    return programService.getUserPrograms(user.user_id, false);
                },
                homePrograms: function (programService, user) {
                    return programService.getUserPrograms(user.user_id, true);
                }
            }
        });
    }

})();
