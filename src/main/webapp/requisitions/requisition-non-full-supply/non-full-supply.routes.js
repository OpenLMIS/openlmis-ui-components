(function() {

    'use strict';

    angular
        .module('requisition-non-full-supply')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('requisitions.requisition.nonFullSupply', {
            url: '/nonFullSupply',
            templateUrl: 'requisitions/requisition-non-full-supply/non-full-supply.html',
            controller: 'NonFullSupplyCtrl',
            controllerAs: 'vm'
        });

    }

})();
