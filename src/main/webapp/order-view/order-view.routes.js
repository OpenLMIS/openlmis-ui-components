(function() {

    'use strict';

    angular
        .module('order-view')
        .config(config);

    config.$inject = ['$stateProvider', 'REQUISITION_RIGHTS', 'FULFILLMENT_RIGHTS'];

    function config($stateProvider, REQUISITION_RIGHTS, FULFILLMENT_RIGHTS) {

        $stateProvider.state('orders.view', {
            controller: 'OrderViewController',
            controllerAs: 'vm',
            label: 'link.viewOrders',
            showInNavigation: true,
            templateUrl: 'order-view/order-view.html',
            url: '/view',
            accessRights: [
                REQUISITION_RIGHTS.REQUISITION_CREATE,
                REQUISITION_RIGHTS.REQUISITION_AUTHORIZE,
                FULFILLMENT_RIGHTS.PODS_MANAGE,
                FULFILLMENT_RIGHTS.ORDERS_VIEW
            ],
            areAllRightsRequired: true,
            resolve: {
                supplyingFacilities: function(facilityFactory, authorizationService) {
                    return facilityFactory.getSupplyingFacilities(
                        authorizationService.getUser().user_id
                    );
                },
                requestingFacilities: function(facilityFactory, authorizationService) {
                    return facilityFactory.getRequestingFacilities(
                        authorizationService.getUser().user_id
                    );
                },
                programs: function(programService, authorizationService) {
                    return programService.getUserPrograms(
                        authorizationService.getUser().user_id
                    );
                }
            }
        });

    }

})();
