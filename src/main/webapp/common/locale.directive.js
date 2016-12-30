
(function(){
    "use strict";

    angular.module('openlmis-core')
        .directive('openlmisLocale', localeDirective);

    localeDirective.$inject = [];
    function localeDirective(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'common/locale-list.html',
            controller: 'LocaleController as locale'
        }
    }

})();
