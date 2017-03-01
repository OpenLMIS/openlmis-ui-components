/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @restrict E
     * @name openlmis-analytics.directive:button
     *
     * @description
     * Adds Google Analytics event listeners to the click event of button
     * elements (including input type="button" and type="submit").
     */
    angular
        .module('openlmis-analytics')
        .directive('button', buttonDirective)
        .directive('input', buttonDirective);

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
