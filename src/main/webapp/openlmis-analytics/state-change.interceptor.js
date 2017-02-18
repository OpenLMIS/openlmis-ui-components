(function() {
    'use strict';

    /**
     *
     * @ngdoc service
     * @name  openlmis-analytics.stateChangeInterceptor
     * @description Sends a pageview to GA whenever the UI-Router view changes
     *
     */

    angular
        .module('openlmis-analytics')
        .run(run);

    run.$inject = ['$rootScope', '$location', 'analyticsService'];

    function run($rootScope, $location, analyticsService) {

        $rootScope.$on('$stateChangeSuccess', function (event) {
            analyticsService.track('send', 'pageview', $location.path());
        });
    }

})();
