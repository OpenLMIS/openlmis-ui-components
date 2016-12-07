
(function(){
    "use strict";

    /**
    *@ngdoc directive
    *@name openlmis-core.directive:select
    *@restrict E
    *@description
    *
    * Adds behavior to the select element, such as disabling the element if there is only one option
    * or and adding placeholder text.
    *
    * @example
    * Ideally all select elements will use ng-model
    * ```
    * <select ng-model="value" placeholder="Empty options"></select>
    * ```
    *
    * This will also work with ngOptions and setting a placeholder with an option element
    * ```
    * <select ng-model="value" ng-options="for something in whatever">
    *    <option>Placeholder text goes here</option>
    * </select>
    * ```
    *
    */

    angular.module("openlmis-core").directive('select', select);

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

                var emptyOption = element.children('option[value=""]');
                if(!emptyOption.length){
                    element.prepend('<option value="" class="placeholder"></option>');
                } else {
                    emptyOption.addClass('placeholder');
                }

                // set the placeholder text
                if(attrs.placeholder){
                    element.children('option.placeholder').text(attrs.placeholder);
                } else {
                    element.children('option.placeholder').text(messageService.get('select.placeholder.default'));
                }

                var options = element.children('option:not(option[value=""]):not(option[value="?"])');

                if(options.length <= 1){
                    element.attr("disabled", true);
                } else {
                    element.attr("disabled", false);
                }
            }
        };
    }
})();
