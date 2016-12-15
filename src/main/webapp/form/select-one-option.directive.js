
(function(){
    "use strict";

    /**
    *@ngdoc directive
    *@name openlmis-core.directive:select-one-option
    *@restrict E
    *@description
    *
    * Disables an select element if there is only one option, and selects that options.
    *
    * @example
    * The following will be rendered like the commented out markup.
    * ```
    * <select ng-model="vm.value">
    *   <option>-- Select an option --</option>
    *   <option value="awesome">Awesome!</option>
    * </select>
    * <!--
    * <select ng-model="vm.value" disabled>
    *   <option>-- Select an option --</option>
    *   <option value="awesome" selected="selected">Awesome!</option>
    * </select>
    * -->
    * ```
    *
    */

    angular.module("openlmis-core").directive('select', select);

    function select() {
        return {
            restrict: 'E',
            replace: false,
            require: ['select', '?ngModel'],
            link: link
        };
    }

    function link(scope, element, attrs, ctrls){
        var selectCtrl = ctrls[0],
        ngModelCtrl = ctrls[1];

        updateSelect();
        if(ngModelCtrl){
            // using instead of $ngModelCtrl.$render
            // beacuse ngSelect uses it
            scope.$watch(function(){
                return ngModelCtrl.$modelValue;
            }, updateSelect);

            // See if ng-repeat or ng-options changed
            scope.$watch(function(){
                return element.html();
            }, updateSelect);
        }

        function updateSelect(){
            var optionsSelector = 'option:not(.placeholder)';
            var options = element.children(optionsSelector);

            if(options.length <= 1){
                element.attr("disabled", true);
            } else {
                element.attr("disabled", false);
            }

            if(options.length == 1){
                element.children('option[selected="selected"]').removeAttr("selected");
                element.children(optionsSelector + ':first').attr('selected', 'selected');
                
                if(ngModelCtrl){
                    var selectedValue = selectCtrl.readValue();
                    ngModelCtrl.$setViewValue(selectedValue);
                }
            }
        }
    }

})();
