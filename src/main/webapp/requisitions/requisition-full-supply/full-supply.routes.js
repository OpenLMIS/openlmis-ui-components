(function() {

    'use strict';

    angular
        .module('requisition-full-supply')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider.state('requisitions.requisition.fullSupply', {
            url: '/fullSupply',
            templateUrl: 'requisitions/requisition-full-supply/full-supply.html',
            controller: 'FullSupplyCtrl',
            controllerAs: 'vm'
        });
    }

})();
