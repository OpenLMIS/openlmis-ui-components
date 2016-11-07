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
            url: '/convertToOrder',
            controller: 'ConvertToOrderCtrl',
            templateUrl: 'requisitions/convert-to-order/convert-to-order.html'
        });

    }

})();