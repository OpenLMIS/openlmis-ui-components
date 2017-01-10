(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name requisition-summary.requisitionSummary
     *
     * @description
     * Responsible for rendering requisition summary and its popover.
     */
    angular
        .module('requisition-summary')
        .directive('requisitionSummary', directive);

    function directive() {
        var directive = {
            controller: 'RequisitionSummaryController',
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            replace: true,
            scope: {
                requisition: '=requisition'
            },
            templateUrl: 'requisition-summary/requisition-summary.html'
        }
        return directive;
    }

    function link(scope, elements, attrs, vm) {
        vm.requisition = scope.requisition;
    }

})();
