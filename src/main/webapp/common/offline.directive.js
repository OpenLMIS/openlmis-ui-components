(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-core.directive:offline
     *
     * @description
     * Directive for determining if user is online or not.
     */

    angular
        .module('openlmis-core')
        .directive('offline', offline);

    offline.$inject = ['OfflineService'];

    function offline(OfflineService) {
        var directive = {
            scope: false,
            replace: false,
            link: link
        }
        return directive;

        /**
         * @ngdoc function
         * @name link
         * @methodOf openlmis-core.directive:offline
         *
         * @description
         * Watches status of connection and updates value in scope.
         *
         */
        function link(scope, element, attr) {
            scope.$watch(function(){
                return OfflineService.isOffline();
            }, function(isOffline) {
                scope.isOffline = isOffline;
            }, true);

            scope.checkConnection = function() {
                return OfflineService.checkConnection();
            };
        }
    }

})();
