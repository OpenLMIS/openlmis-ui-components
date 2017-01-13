(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-table.table
     *
     * @description
     * Wraps the table with a div so it can be used with flexbox. Table element, due to it's display
     * mode(table), does not support flex-grow and flex-shrink CSS properties.
     */
    angular
        .module('openlmis-table')
        .directive('table', directive);

    directive.$inject = [];

    function directive() {
        var directive = {
            restrict: 'E',
            link: link
        }
        return directive;
    }

    function link(scope, element) {
        var parent = angular.element(element.parent()[0]);
        if(parent.hasClass('table-container')) element.wrap('<div class="flex-table"></div>');
    }

})();
