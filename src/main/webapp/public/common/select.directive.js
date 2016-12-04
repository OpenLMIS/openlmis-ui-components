
(function(){
    "use strict";

    /**
    *@ngdoc directive
    *@name openlmis-core.directive:select
    *@restrict E
    *@description directive for simple implementing <ui-select> element.
    *
    */

    angular.module("openlmis-core").directive('select', select);

    select.$inject = ['$parse'];
    function select($parse) {
        return {
            restrict: 'E',
            replace: false,
            require: "ngModel",
            priority: 10, // Sets this link function to run AFTER ngSelect
            link: function(scope, element, attrs, ngModelCtrl){

                var numOptions = element.children().length;

                if(numOptions <= 1){
                    element.attr("disabled", true);
                }
                if(numOptions == 1){
                    var option = angular.element(element.children()[0]);
                    ngModelCtrl.$setViewValue(option.value);
                }

                jQuery(element).selectize();
            }
        };
    }
})();