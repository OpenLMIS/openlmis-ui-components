(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .config(routes);

    routes.$inject = ['$stateProvider', 'RequisitionRights'];

    function routes($stateProvider, RequisitionRights) {

        $stateProvider.state('requisitions.convertToOrder', {
            showInNavigation: true,
            label: 'link.requisitions.convertToOrder',
            url: '/convertToOrder?filterBy&filterValue&sortBy&descending',
            controller: 'ConvertToOrderCtrl',
            templateUrl: 'requisitions/convert-to-order/convert-to-order.html',
            accessRight: [RequisitionRights.REQUISITION_CONVERT_TO_ORDER],
            params: {
                filterBy: 'all',
                filterValue: ''
            },
            resolve: {
                requisitions: requisitionsResolve
            }
        });

        function requisitionsResolve($stateParams, RequisitionService) {
            return RequisitionService.forConvert({
                filterBy: $stateParams.filterBy,
                filterValue: $stateParams.filterValue,
                sortBy: $stateParams.sortBy,
                descending: $stateParams.descending
            });
        }

    }

})();
