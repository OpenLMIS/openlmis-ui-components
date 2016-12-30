
(function(){
    "use strict";

    angular.module('openlmis-locale')
        .directive('openlmisLocale', localeDirective);

    localeDirective.$inject = [];
    function localeDirective(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'openlmis-locale/locale-list.html',
            controller: 'LocaleController as locale'
        }
    }

})();
