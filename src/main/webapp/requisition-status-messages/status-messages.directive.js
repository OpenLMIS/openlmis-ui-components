(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name requisition-status-messages.requisitionStatusMessages
     *
     * @description
     * Responsible for adding new status messages.
     */
    angular
        .module('requisition-status-messages')
        .directive('statusMessages', directive);

    function directive() {
        var directive = {
            controller: 'StatusMessagesController',
            controllerAs: 'vm',
            restrict: 'E',
            replace: true,
            scope: {
                requisition: '=requisition'
            },
            templateUrl: 'requisition-status-messages/status-messages.html'
        }
        return directive;
    }
})();
