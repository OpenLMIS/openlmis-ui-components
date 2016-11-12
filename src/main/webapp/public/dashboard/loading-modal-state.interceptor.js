
(function(){
    "use strict";

    angular.module('openlmis-core')
        .run(stateInterceptorListeners);

    stateInterceptorListeners.$inject = ["$rootScope", "LoadingModal"];
    function stateInterceptorListeners($rootScope, LoadingModal){

        $rootScope.$on('$stateChangeStart', LoadingModal.open);
        $rootScope.$on('$stateChangeSuccess', LoadingModal.close);
        $rootScope.$on('$stateChangeError', LoadingModal.close);
        $rootScope.$on('$stateNotFound', LoadingModal.close);
    }

})();