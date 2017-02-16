(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-analytics.button
     *
     * @description
     * Responsible for adding event listener to standard HTML button tag.
     */
    angular
        .module('openlmis-analytics')
        .directive('button', buttonDirective)
        .directive('type', inputDirective);

    buttonDirective.$inject = ['$window', '$location'];
    inputDirective.$inject = ['$window', '$location'];

    function buttonDirective($window, $location) {
        var directive = {
            restrict: 'E',
            compile: function (element, attributes) {
                return function (scope, element) {
                    element.on('click', function () {
                        console.log('You clicked ' + labelText);
                        $window.ga('send', 'event', {
                            eventCategory: 'Button Click',
                            eventAction: labelText,
                            eventLabel: $location.path()
                        });
                    });
                    var labelText = extractLabelFromText(element[0].value ? element[0].value : element[0].textContent);
                    console.log('Added on click event for ' + labelText);
                }
            }
        }
        return directive;
    }

    function inputDirective($window, $location) {
        var directive = {
            restrict: 'A',
            compile: function (element, attributes) {
                if (element.prop('nodeName') === 'INPUT' && (attributes.type === 'button' || attributes.type === 'submit')) {
                    return function (scope, element) {
                        element.on('click', function () {
                            console.log('You clicked ' + labelText);
                            $window.ga('send', 'event', {
                                eventCategory: 'Button Click',
                                eventAction: labelText,
                                eventLabel: $location.path()
                            });
                        });
                        var labelText = extractLabelFromText(element[0].value ? element[0].value : element[0].textContent);
                        console.log('Added on click event for ' + labelText);
                    }
                }
            }
        }
        return directive;
    }

    /*
     * This function assumes that text is in the exact format {{'label.name' | message}} and gets label.name.
     */
    function extractLabelFromText(text) {
        var firstQuote = text.indexOf("'");
        var lastQuote = text.lastIndexOf("'");
        return text.slice(firstQuote + 1, lastQuote); // +1 because don't include the first quote
    }

})();
