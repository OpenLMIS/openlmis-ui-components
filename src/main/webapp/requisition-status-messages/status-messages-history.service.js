(function(){
    "use strict";

    /**
     * @ngdoc service
     * @name requisition-status-messages.statusMessagesHistoryService
     *
     * @description
     * Displays modal with status messages history.
     */

    angular
        .module('requisition-status-messages')
        .service('statusMessagesHistoryService', service);

    service.$inject = ['$q', '$rootScope', '$ngBootbox', 'messageService', '$compile', '$templateRequest'];

    function service($q, $rootScope, $ngBootbox, messageService, $compile, $templateRequest) {

        var deferred, vm;

        this.show = show;

        /**
         * @ngdoc function
         * @name show
         * @methodOf requisition-status-messages.statusMessagesHistoryService
         *
         * @description
         * Shows modal with status messages history.
         *
         * @param {Object} requisition Requisition to get its history
         * @return {Promises} status messages for requisition and template for modal
         */
        function show(requisition) {
            var scope = $rootScope.$new();

            deferred = $q.defer();

            scope.vm = {};
            vm = scope.vm;

            vm.requisition = requisition;

            $templateRequest('requisition-status-messages/status-messages-history.html')
            .then(function(template) {
                $ngBootbox.customDialog({
                    title: messageService.get('label.requisitionHistory'),
                    message: $compile(angular.element(template))(scope),
                    className: 'status-messages-history'
                });
            }, reject);

            return deferred.promise;
        }

        function reject(deferred) {
            deferred.reject();
        }
    }
})();
