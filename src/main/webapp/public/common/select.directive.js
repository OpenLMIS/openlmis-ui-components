
(function(){
    "use strict";

    /**
    *@ngdoc directive
    *@name openlmis-core.directive:select
    *@restrict E
    *@description directive for simple implementing <ui-select> element.
    *
    */

    angular.module("openlmis-core").directive('openlmis-select', select);

    select.$inject = ['messageService'];
    function select(messageService) {
        return {
            restrict: 'E',
            replace: false,
            require: ['ngModel', 'select'],
            priority: 111, // Runs after ngSelect, ngOptions, and ngOption
            link: function(scope, element, attrs, ctrls){
                var ngModelCtrl = ctrls[0];
                var selectCtrl = ctrls[1];

                ngModelCtrl.$render = setSelectState;

                function setSelectState(){
                    // Add empty option, if not already there
                    var emptyOption = element.children('option[value=""]');
                    if(!emptyOption.length){
                        element.prepend('<option value=""></option>');
                    }

                    // set the placeholder text
                    if(attrs.placeholder){
                        emptyOption.text(attrs.placeholder);
                    } else {
                        emptyOption.text(messageService.get('select.placeholder.default'));
                    }

                    if(!ngModelCtrl.$viewValue || ngModelCtrl.$viewValue == ""){
                        ngModelCtrl.$setViewValue("", false);
                        element.val("");
                    }

                    var options = element.children('option:not(option[value=""]):not(option[value="?"])');

                    if(options.length <= 1){
                        element.attr("disabled", true);
                    } else {
                        element.attr("disabled", false);
                    }
                    
                    if(options.length == 1){
                        element.val(options[0].value);
                        ngModelCtrl.$setViewValue(
                            selectCtrl.readValue() // if ngOptions is used with object, this fetches the object
                            );
                    }
                }
            }
        };
    }
})();