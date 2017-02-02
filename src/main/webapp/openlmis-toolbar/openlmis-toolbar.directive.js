(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-toolbar.openlmisToolbar
     *
     * @description
     * Responsible for transcluding toolbar controls into a toolbar div.
     */
    angular
        .module('openlmis-toolbar')
        .directive('openlmisToolbar', directive);

    directive.$inject = [];

    function directive() {
        var directive = {
            replace: true,
            restrict: 'E',
            templateUrl: 'openlmis-toolbar/openlmis-toolbar.html',
            transclude: true
        };
        return directive;
    }

})();
