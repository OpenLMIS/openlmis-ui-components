
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
            require: ['ngModel', 'select'],
            priority: 101, // Sets link function to run AFTER ngSelect and ngOption
            link: function(scope, element, attrs, ctrls){
                var ngModelCtrl = ctrls[0];
                var selectCtrl = ctrls[1];

                var numOptions = element.children().length;

                if(numOptions <= 1){
                    element.attr("disabled", true);
                }
                if(numOptions == 1){
                    var option = angular.element(element.children()[0]);
                    ngModelCtrl.$setViewValue(option.value);
                }

                function onChange(value){
                    element.val(value);
                    var viewValue = selectCtrl.readValue();
                    ngModelCtrl.$setViewValue(viewValue);
                }

                jQuery(element).select2()
                .on('change', function(e){
                    onChange(e.val);
                });
            }
        };
    }
})();