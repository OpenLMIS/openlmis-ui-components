(function() {

    'use strict';

    angular
        .module('openlmis-locale')
        .directive('openlmisLocale', directive);

    directive.$inject = [];

    function directive() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'openlmis-locale/locale-list.html',
            controller: 'LocaleController',
            controllerAs: 'locale'
        }
    }

})();
