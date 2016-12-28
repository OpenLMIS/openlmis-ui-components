(function() {

    'use strict';

    angular.module('openlmis.requisitions').config(config);

    config.$inject = ['$stateProvider', 'RequisitionRights'];
    function config($stateProvider, RequisitionRights) {

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
