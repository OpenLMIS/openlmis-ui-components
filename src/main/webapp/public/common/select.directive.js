
(function(){
    "use strict";

    /**
    *@ngdoc directive
    *@name openlmis-core.directive:openlmisSelect
    *@restrict E
    *@description directive for simple implementing <ui-select> element.
    *
    */

    angular.module("openlmis-core").directive('openlmisSelect', select);

    function select($parse) {
        return {
            scope: {
                ngModel: '=ngModel',
                items: '=items',
                placeholder: '@?placeholder',
                fieldDisplayed: '@fieldDisplayed',
                orderBy: '@?',
                trackBy: '@?'
            },
            restrict: 'E',
            replace: 'true',
            templateUrl: 'common/select.html',
            controller: 'SelectController',
        };
    }
})();