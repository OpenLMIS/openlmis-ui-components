
(function(){
    "use strict";

    angular.module('openlmis-core')
        .run(stateInterceptorListeners);

    stateInterceptorListeners.$inject = ["$rootScope", "$timeout", "LoadingModal"];
    function stateInterceptorListeners($rootScope, $timeout, LoadingModal){

        $rootScope.$on('$stateChangeStart', createModal);
        //$rootScope.$on('$stateChangeSuccess', closeModal);
        //$rootScope.$on('$stateChangeError', closeModal);
        //$rootScope.$on('$stateNotFound', closeModal);

        var timeoutPromise;

        function createModal(){
            console.log("state change - create");
            // pause timeout so modal doesn't open immedately all the damn time
 //           timeoutPromise = $timeout(function(){
                // open modal
                LoadingModal.startLoading();
                timeoutPromise = null;
 //           }, 500);
        }

        function closeModal(){
            console.log("state change - close");
            if(timeoutPromise){
                // didn't have chance to open modal, cancel opening it
                $timeout.cancel(timeoutPromise)
                timeoutPromise = null;
            } else {
                LoadingModal.stopLoading();
                // close loading modal...
            }
        }
    }

})();