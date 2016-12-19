
(function(){
    "use strict";

    /**
    *@ngdoc directive
    *@name openlmis-core.directive:select-placeholder
    *@restrict E
    *@description
    *
    * Sets a default placeholder message on select elements, if one isn't
    * previously set as an attribute or as the first option element with an
    * empty string as it's value. 
    *
    * @example
    * 
    * ```
    * <select placeholder="Custom placeholder"></select>
    * ```
    *
    * This will also work with ngOptions and setting a placeholder with an
    * option element that has it's value set to an empty string, or has the
    * class placeholder.
    *
    * Setting a placeholder without a value attribute will not work, because
    * ngOption will set the value to the option's text.
    * ```
    * <select ng-model="value" ng-options="for something in whatever">
    *    <option value="">Placeholder text goes here</option>
    * </select>
    * ```
    *
    * To not set a placeholder, use the no-placeholder attribute. If you don't
    * want a placeholder, you should make sure the element always has a value.
    * ```
    * <select no-placeholder>
    *   <option value="1">This will be immedately selected</option>
    *   <option value="2">This is another option</option>
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
            require: ['select', '?ngModel'],
            link: function(scope, element, attrs, ctrls){
                if('noPlaceholder' in attrs) return;

                var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1];

                var emptyOption = angular.element('<option value="" class="placeholder"></option>');
                var clearLink = angular.element('<a class="clear" href="#">' + messageService.get('select.clear') + '</a>');

                var emptyValue = undefined;

                dispayPlaceholder();
                element.change(updateSelectValue);
                if(ngModelCtrl){
                    scope.$watch(function(){
                        return ngModelCtrl.$viewValue;
                    }, function(value){
                        selectCtrl.writeValue(value);
                        dispayPlaceholder();
                    });
                }
                
                function dispayPlaceholder(){
                    if(!element.children('option[selected="selected"]:not(.placeholder)').length){
                        createEmptyOption();
                        clearLink.remove();
                    } else {
                        emptyOption.remove();
                        clearLink.insertAfter(element);
                        clearLink.click(clearSelectValue);
                    }
                }

                function createEmptyOption(){                    
                    element.children('option').each(function(index, option){
                        option = angular.element(option);
                        if(!option.val() || option.val() == ""){
                            emptyOption = option;
                            option.addClass('placeholder');
                        }
                    });
                    if(!element.children('option.placeholder').length){
                        element.prepend(emptyOption);
                    }
                    emptyOption.attr("selected", "selected");

                    if(emptyOption.text()==""){
                        if(attrs.placeholder){
                            element.children('option.placeholder').text(attrs.placeholder);
                        } else {
                            element.children('option.placeholder').text(messageService.get('select.placeholder.default'));
                        }
                    }
                }

                function updateSelectValue(){
                    var newValue = element.val();
                    element.children('option[selected="selected"]').removeAttr('selected');
                    element.children('option').each(function(index, option){
                        option = angular.element(option);
                        if(option.val() == newValue){
                            option.attr("selected", "selected");
                        }
                    });
                    dispayPlaceholder();
                }

                function clearSelectValue(event){
                    event.preventDefault();
                    element.children('option[selected="selected"]').removeAttr('selected');
                    if(ngModelCtrl){
                        ngModelCtrl.$setViewValue(emptyValue);
                    }
                    dispayPlaceholder();
                }
            }
        };
    }

})();
