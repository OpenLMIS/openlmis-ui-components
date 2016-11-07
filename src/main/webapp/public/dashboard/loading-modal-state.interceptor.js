
(function(){
    "use strict";

    angular.module('openlmis-core')
        .run(stateInterceptorListeners);

    stateInterceptorListeners.$inject = ["$rootScope", "$timeout", "LoadingModal"];
    function stateInterceptorListeners($rootScope, $timeout, LoadingModal){

        $rootScope.$on('$stateChangeStart', createModal);
        $rootScope.$on('$stateChageSuccess', closeModal);
        $rootScope.$on('$stateChageError', closeModal);
        $rootScope.$on('$stateNotFound', closeModal);

        var timeoutPromise;

        function createModal(){
            // pause timeout so modal doesn't open immedately all the damn time
            timeoutPromise = $timeout(function(){
                // open modal
                timeoutPromise = null;
            }, 500);
        }

        function closeModal(){
            if(timeoutPromise){
                // didn't have chance to open modal, cancel opening it
                $timeout.cancel(timeoutPromise)
                timeoutPromise = null;
            } else {
                // close loading modal...
            }
        }
    }

})();