(function() {

    'use strict';

    angular
        .module('proof-of-delivery-manage')
        .config(routes);

    routes.$inject = ['$stateProvider', 'FULFILLMENT_RIGHTS', 'REQUISITION_RIGHTS'];

    function routes($stateProvider, FULFILLMENT_RIGHTS, REQUISITION_RIGHTS) {

        $stateProvider.state('orders.podManage', {
			showInNavigation: true,
			label: 'link.orders.podManage',
            url: '/manage',
            controller: 'ProofOfDeliveryManageController',
            controllerAs: 'vm',
            templateUrl: 'proof-of-delivery-manage/proof-of-delivery-manage.html',
            accessRights: [
                REQUISITION_RIGHTS.REQUISITION_CREATE,
                FULFILLMENT_RIGHTS.PODS_MANAGE
            ],
            areAllRightsRequired: true,
            resolve: {
                facility: function(facilityFactory) {
                    return facilityFactory.getUserHomeFacility();
                },
                userId: function(authorizationService) {
                    return authorizationService.getUser().user_id;
                },
                supervisedPrograms: function (programService, userId) {
                    return programService.getUserPrograms(userId, false);
                },
                homePrograms: function (programService, userId) {
                    return programService.getUserPrograms(userId, true);
                }
            }
        });

    }

})();
