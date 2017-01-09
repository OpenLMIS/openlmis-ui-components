(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name requisition-view.requisitionSummary
     *
     * @description
     * Responsible for rendering requisition summary and its popover.
     */
    angular
        .module('requisition-view')
        .directive('requisitionSummary', directive);

    function directive() {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                requisition: '=requisition'
            },
            templateUrl: 'requisition-view/requisition-summary.html',
            controller: 'RequisitionSummaryCtrl',
            controllerAs: 'vm'
        }
        return directive;
    }

})();
