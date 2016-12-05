
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

                scope.$watch(function(){
                    return element.children().length;
                }, setSelectState);

                setSelectState();

                function setSelectState(){
                    var select2Options = {
                        placeholder: false,
                        allowClear: true
                    };

                    var numOptions = element.children().length;

                    if(numOptions <= 1){
                        element.attr("disabled", true);
                    } else {
                        element.attr("disabled", false);
                    }
                    
                    if(numOptions == 1){
                        var firstValue = element.children()[0].value;
                        setViewValue(firstValue);
                    }

                    jQuery(element).select2(select2Options)
                    .on('change', function(e){
                        setViewValue(e.val);
                    });
                }

                function setViewValue(value){
                    element.val(value);
                    var viewValue = selectCtrl.readValue();
                    ngModelCtrl.$setViewValue(viewValue);
                }
            }
        };
    }
})();