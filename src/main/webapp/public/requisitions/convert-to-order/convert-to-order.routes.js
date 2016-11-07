(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('requisitions.convertToOrder', {
            showInNavigation: true,
            label: 'link.requisitions.convertToOrder',
            url: '/convertToOrder?filterBy&filterValue&sortBy&descending',
            controller: 'ConvertToOrderCtrl',
            templateUrl: 'requisitions/convert-to-order/convert-to-order.html',
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