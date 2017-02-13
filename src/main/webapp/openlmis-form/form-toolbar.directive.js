(function(){
    "use strict";

    angular.module('openlmis-form')
    .directive('form', formDirective);

    formDirective.$inject = [];
    function formDirective(){
        return {
            restrict: 'E',
            link: link
        }
    }

    function link(scope, element, attrs){
        var submitButton = element.children('input[type="submit"]');

        if (submitButton.length == 1) {
            var wrap = angular.element('<div class="button-group"></div>');
            wrap.append(submitButton.siblings('input[type="button"], button, .button-group'));
            wrap.insertBefore(submitButton);
            wrap.prepend(submitButton);
        }
    }

})();