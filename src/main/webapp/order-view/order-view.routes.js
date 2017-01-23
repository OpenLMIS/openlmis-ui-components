(function() {

    'use strict';

    angular
        .module('order-view')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider.state('orders.view', {
            controller: 'OrderViewController',
            controllerAs: 'vm',
            label: 'link.viewOrders',
            showInNavigation: true,
            templateUrl: 'order-view/order-view.html',
            url: '/view',
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
