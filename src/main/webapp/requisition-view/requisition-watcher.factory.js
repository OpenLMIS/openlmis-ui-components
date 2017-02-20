(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition-view.RequisitionWatcher
     *
     * @description
     * Provides auto-save feature to the requisition. Notifies when changes are being made to the
     * watched requisition - this can be avoided by silencing the watcher.
     */
    angular
        .module('requisition-view')
        .factory('RequisitionWatcher', factory);

    factory.$inject = ['$rootScope', '$timeout', 'notificationService', 'localStorageFactory'];

    function factory($rootScope, $timeout, notificationService, localStorageFactory) {

        RequisitionWatcher.prototype.makeSilent = makeSilent;
        RequisitionWatcher.prototype.makeLoud = makeLoud;

        return RequisitionWatcher;

        function RequisitionWatcher(scope, requisition) {
            var watcher = this,
                storage = localStorageFactory('requisitions');

            watcher.isLoud = true;

            scope.$watch(function() {
                return requisition.requisitionLineItems;
            }, function(oldValue, newValue) {
                if (oldValue !== newValue) {
                    $timeout.cancel(watcher.notificationTimeout);
                    watcher.notificationTimeout = $timeout(function() {
                        if (watcher.isLoud) {
                            notificationService.success('msg.requisitionSaved');
                            watcher.notificationTimeout = undefined;
                        }
                    }, 3000);

                    $timeout.cancel(watcher.syncTimeout);
                    watcher.syncTimeout = $timeout(function() {
                        requisition.$modified = true;
                        storage.put(requisition);
                        watcher.syncTimeout = undefined;
                    }, 500)
                }
            }, true);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.RequisitionWatcher
         * @name makeSilent
         *
         * @description
         * Makes the watcher silent - no notification will be displayed after this method has been
         * called.
         */
        function makeSilent() {
            var watcher = this;
            $timeout.cancel(watcher.notificationTimeout);
            watcher.isLoud = false;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.RequisitionWatcher
         * @name makeLoud
         *
         * @description
         * Makes the watcher loud - notification will be shown once in a while when editing the
         * watched requisition.
         */
        function makeLoud() {
            this.isLoud = true;
        }
    }

})();
