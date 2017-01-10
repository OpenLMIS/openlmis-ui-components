(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-offline.directive:offline
     * @restrict A
     *
     * @description
     * Directive for determining if user is online or not.
     *
     * @example
     * ```
     * <button offline ng-disabled="isOffline">Do something</button>
     * ```
     */

    angular
        .module('openlmis-offline')
        .directive('offline', offline);

    offline.$inject = ['offlineService'];

    function offline(offlineService) {
        var directive = {
            restrict: 'A',
            scope: false,
            replace: false,
            link: link
        }
        return directive;

        function link(scope, element, attr) {

            /**
             * @ngdoc property
             * @name isOffline
             * @propertyOf openlmis-offline.directive:offline
             * @type {Boolean}
             *
             * @description
             * A boolean that says if there is an internet connection, as
             * determined by the offlineService.
             */
            scope.$watch(function(){
                return offlineService.isOffline();
            }, function(isOffline) {
                scope.isOffline = isOffline;
            }, true);

            /**
             * @ngdoc property
             * @name checkConnection
             * @propertyOf openlmis-offline.directive:offline
             * @type {Boolean}
             *
             * @description
             * Makes the offlineService check if there is a connection to the internet.
             */
            scope.checkConnection = function() {
                return offlineService.checkConnection();
            };
        }
    }

})();
