(function(){
    "use strict";


    /**
     * @ngdoc service
     * @name openlmis-navigation.interceptor:OfflineNavigation
     *
     * @description
     * Check if state being transitioned is able to be viewed offline, if the
     * browser is offline.
     *
     */

    angular.module('openlmis-navigation')
    .run(offlineNavigationInterceptor);

    offlineNavigationInterceptor.$inject = ['$rootScope', 'alertService', 'loadingModalService', 'offlineService'];
    function offlineNavigationInterceptor($rootScope, alertService, loadingModalService, offlineService){
        $rootScope.$on('$stateChangeStart', checkOffline);

        function checkOffline(event, toState){
            if(offlineService.isOffline() && !toState.isOffline){
                event.preventDefault();
                loadingModalService.close();
                alertService.error('navigation.state.offline');
            }
        }
    }

})();