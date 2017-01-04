(function() {

    "use strict";

    angular.module('openlmis-404').config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('404', {
            url: '/404',
            templateUrl: 'openlmis-404/404.html'
        });

    }

})();
