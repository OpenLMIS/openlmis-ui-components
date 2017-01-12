(function() {

    'use strict';

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
        element.wrap('<div class="flex-table"></div>');
    }

})();
