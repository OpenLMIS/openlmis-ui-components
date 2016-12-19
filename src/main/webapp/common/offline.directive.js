(function() {

    'use strict';

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
