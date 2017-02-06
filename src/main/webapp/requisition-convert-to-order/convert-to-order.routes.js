(function() {

    'use strict';

    angular
        .module('requisition-convert-to-order')
        .config(routes);

    routes.$inject = ['$stateProvider', 'FULFILLMENT_RIGHTS'];

    function routes($stateProvider, FULFILLMENT_RIGHTS) {

        $stateProvider.state('requisitions.convertToOrder', {
            showInNavigation: true,
            label: 'link.requisitions.convertToOrder',
            url: '/convertToOrder?filterBy&filterValue&sortBy&descending',
            controller: 'ConvertToOrderController',
            controllerAs: 'vm',
            templateUrl: 'requisition-convert-to-order/convert-to-order.html',
            accessRights: [FULFILLMENT_RIGHTS.ORDERS_EDIT],
            params: {
                filterBy: 'all',
                filterValue: ''
            },
            resolve: {
                requisitions: requisitionsResolve
            }
        });

        function requisitionsResolve($stateParams, requisitionService) {
            return requisitionService.forConvert({
                filterBy: $stateParams.filterBy,
                filterValue: $stateParams.filterValue,
                sortBy: $stateParams.sortBy,
                descending: $stateParams.descending
            });
        }

    }

})();
