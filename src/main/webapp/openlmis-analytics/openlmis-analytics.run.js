(function() {

    'use strict';

    angular
        .module('openlmis-analytics')
        .run(run);

    run.$inject = ['$rootScope', '$window', '$location', '$timeout'];

    function run($rootScope, $window, $location, $timeout) {
        $window.ga('create', '@@ANALYTICS_TRACKING_ID', 'auto');

        $rootScope.$on('$stateChangeSuccess', function (event) {
            $window.ga('send', 'pageview', $location.path());
        });
    }

})();
