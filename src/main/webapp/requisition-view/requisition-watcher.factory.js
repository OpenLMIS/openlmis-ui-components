(function() {

    'use strict';

    angular
        .module('requisition-view')
        .factory('RequisitionWatcher', factory);

    factory.$inject = ['$rootScope', '$timeout', 'notificationService', 'localStorageFactory'];

    function factory($rootScope, $timeout, notificationService, localStorageFactory) {
        RequisitionWatcher.prototype.makeSilent = makeSilent;
        RequisitionWatcher.prototype.makeLoud = makeLoud;

        return RequisitionWatcher;

        function RequisitionWatcher(requisition) {
            var watcher = this,
                storage = localStorageFactory('requisitions');

            watcher.isLoud = true;

            $rootScope.$watch(function() {
                return requisition;
            }, function(oldValue, newValue) {
                if (oldValue !== newValue) {
                    requisition.$modified = true;
                    storage.put(requisition);
                    $timeout.cancel(watcher.notificationTimeout);
                    if (watcher.isLoud) {
                        watcher.notificationTimeout = $timeout(function() {
                            notificationService.success('msg.requisitionSaved');
                            watcher.notificationTimeout = undefined;
                        }, 3000);
                    }
                }
            }, true);
        }

        function makeSilent() {
            var watcher = this;
            $timeout.cancel(watcher.notificationTimeout);
            watcher.isLoud = false;
        }

        function makeLoud() {
            this.isLoud = true;
        }
    }

})();
