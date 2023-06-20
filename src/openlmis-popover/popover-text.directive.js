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
     * @restrict A
     * @name openlmis-popover.directive:popoverText
     *
     * @description
     * Takes the markup from the popover, and adds it to the popoverCtrl.
     *
     * The text that is set is not explicitly rendered, and is rendered in an
     * isolated scope.
     */

    angular.module('openlmis-popover')
        .directive('openlmisPopover', popoverDirective);

    popoverDirective.$inject = ['$compile', '$templateRequest'];
    function popoverDirective($compile, $templateRequest) {
        return {
            restrict: 'A',
            require: 'openlmisPopover',
            link: popoverLink
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-popover.directive:popoverText
         * @name link
         *
         * @description
         * Watches popover text attribute. If the attribute is an empty sting,
         * the popover element is removed.
         */
        function popoverLink(scope, element, attrs, popoverCtrl) {

            var textElement,
                textScope;

            scope.$watch(function() {
                if (attrs.openlmisPopover && attrs.openlmisPopover !== '') {
                    return attrs.openlmisPopover;
                }
                return false;

            }, function(text) {
                if (text && textElement && textScope) {
                    textScope.text = text;
                } else if (text) {
                    makePopoverText(text);
                } else {
                    removePopoverText();
                }
            });

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverText
             * @name makePopoverText
             *
             * @param {String} text The text to render
             *
             * @description
             * Takes the text that needs to be rendered, adds it to a template
             * that is compiled, and added to the popover controller.  
             */
            function makePopoverText(text) {
                // make sure elements are really clear...
                removePopoverText();

                $templateRequest('openlmis-popover/popover-text.html')
                    .then(function(html) {
                        textScope = scope.$new();
                        textScope.text = text;
                        textElement = $compile(html)(textScope);

                        popoverCtrl.addElement(textElement);
                    });
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverText
             * @name removePopoverText
             *
             * @description
             * Checks if the there are text elements added; if so removes the
             * text element and destroys the text's scope.
             */
            function removePopoverText() {
                if (textElement) {
                    popoverCtrl.removeElement(textElement);
                    textElement = undefined;
                }
                if (textScope) {
                    textScope.$destroy();
                    textScope = undefined;
                }
            }
        }
    }

})();
