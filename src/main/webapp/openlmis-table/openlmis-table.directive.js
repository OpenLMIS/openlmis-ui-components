(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-table:openlmisTable
     *
     * @description
     * Checks if the element is table and if so, wraps it in a div to imitate flex behavior.
     */
    angular
        .module('openlmis-table')
        .directive('openlmisTable', directive);

    directive.$inject = [];

    function directive() {
        var directive = {
            link: link,
            restrict: 'C',
            replace: false
        };
        return directive;
    }

    function link(scope, element) {
        if (element.filter('table').length) {
            element.removeClass('openlmis-table');
            element.wrap('<div class="openlmis-table"></div>');
        }
    }

})();
