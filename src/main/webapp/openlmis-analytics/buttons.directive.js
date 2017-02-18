(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-analytics.directive:button
     *
     * @description
     * Adds Google Analytics event listeners to the click event of button 
     * elements (including input type="button" and type="submit").
     */
    angular
        .module('openlmis-analytics')
        .directive('button', buttonDirective)

    buttonDirective.$inject = ['analyticsService', '$location'];
    function buttonDirective(analyticsService, $location) {
        return {
            restrict: 'E',
            compile: compile
        }

        // Compiles the directive, only adding the link function to an input
        // or button element
        function compile(element, attributes) {
            var isInputButton = (element.prop('nodeName') === 'INPUT' && (attributes.type === 'button' || attributes.type === 'submit')),
            isButton = element.prop('nodeName') === 'BUTTON';
            
            if(isInputButton || isButton){
                return link;
            }
        }

        // Applies event listener to the element, and saves the original
        // button text value before it is translated
        function link (scope, element) {
            var labelText = extractLabelFromText(element[0].value ? element[0].value : element[0].textContent);

            element.on('click', function () {
                analyticsService.track('send', 'event', {
                    eventCategory: 'Button Click',
                    eventAction: labelText,
                    eventLabel: $location.path()
                });
            });
        }
    }



    // This function assumes that text is in the exact format {{'label.name' | message}} and gets label.name.
    function extractLabelFromText(text) {
        var firstQuote = text.indexOf("'");
        var lastQuote = text.lastIndexOf("'");
        return text.slice(firstQuote + 1, lastQuote); // +1 because don't include the first quote
    }

})();
