
(function(){
    "use strict";

    angular.module('openlmis-core')
        .run(stateInterceptorListeners);

    stateInterceptorListeners.$inject = ["$rootScope", "LoadingModalService"];
    function stateInterceptorListeners($rootScope, LoadingModalService){
        $rootScope.$on('$stateChangeStart', LoadingModalService.open);
        $rootScope.$on('$stateChangeSuccess', LoadingModalService.close);
        $rootScope.$on('$stateChangeError', LoadingModalService.close);
        $rootScope.$on('$stateNotFound', LoadingModalService.close);
    }

})();