(function() {

    'use strict';

    angular
        .module('openlmis-core')
        .directive('offline', offline);

    offline.$inject = ['OfflineService'];

    function offline(OfflineService) {
        var directive = {
            templateUrl: 'dashboard/header.html',
            link: link
        }
        return directive;

        function link(scope, element, attr) {
            scope.$watch('checkConnection', function(data) {
                scope.isOffline = data;
            }, true);

            scope.checkConnection = function() {
                return OfflineService.isOffline();
            };
        }
    }

})();
