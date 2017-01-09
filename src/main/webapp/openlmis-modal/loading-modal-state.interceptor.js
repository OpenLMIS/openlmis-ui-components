
(function(){
    "use strict";

    angular.module('openlmis-modal')
        .run(stateInterceptorListeners);

    stateInterceptorListeners.$inject = ["$rootScope", "loadingModalService"];
    function stateInterceptorListeners($rootScope, loadingModalService){
        $rootScope.$on('$stateChangeStart', loadingModalService.open);
        $rootScope.$on('$stateChangeSuccess', loadingModalService.close);
        $rootScope.$on('$stateChangeError', loadingModalService.close);
        $rootScope.$on('$stateNotFound', loadingModalService.close);
    }

})();