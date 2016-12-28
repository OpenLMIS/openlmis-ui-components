(function() {

    'use strict';

    angular.module('requisition').config(routes);

    routes.$inject = ['$stateProvider', 'RequisitionRights'];

    function routes($stateProvider, RequisitionRights) {

        $stateProvider.state('requisitions', {
            abstract: true,
            showInNavigation: true,
            priority: 1,
            label: 'link.requisitions',
            url: '/requisitions',
            template: '<div ui-view></div>'
        });

    }

})();
