(function() {

    'use strict';

    angular.module('requisition').config(routes);

    routes.$inject = ['$stateProvider', 'REQUISITION_RIGHTS'];

    function routes($stateProvider, REQUISITION_RIGHTS) {

        $stateProvider.state('requisitions', {
            abstract: true,
            showInNavigation: true,
            priority: 2,
            label: 'link.requisitions',
            url: '/requisitions',
            template: '<div ui-view></div>'
        });

    }

})();
