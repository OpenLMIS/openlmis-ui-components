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
     * @name openlmis-popover.directive:popoverTemplate
     *
     * @description
     * Renders a template in the current scope, and attaches it as a popover to
     * the current element.
     */

    angular.module('openlmis-popover')
        .directive('popoverTemplate', popoverDirective);

    popoverDirective.$inject = ['$compile', '$templateRequest'];
    function popoverDirective($compile, $templateRequest) {
        return {
            restrict: 'A',
            require: 'openlmisPopover',
            link: popoverLink
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-popover.directive:popoverTemplate
         * @name link
         *
         * @description
         * This is the link function for the directive, which watches the
         * 'popoverTemplate' attribute. If the attribute is not null and not an
         * empty string, then it will try to load the template.
         *
         * The remove template function is called on any change, because we
         * assume that any different URL will be a totally different template.
         */
        function popoverLink(scope, element, attrs, popoverCtrl) {
            var popoverElement;

            scope.$watch(function() {
                if (attrs.popoverTemplate && attrs.popoverTemplate !== '') {
                    return attrs.popoverTemplate;
                }
                return false;

            }, function(templateURL) {
                removePopoverTemplate();
                if (templateURL) {
                    makePopoverTemplate(templateURL);
                }
            });

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverTemplate
             * @name makePopoverTemplate
             *
             * @description
             * Gets and renders the template URL, then adds it to the current
             * scope.
             */
            function makePopoverTemplate(url) {
                $templateRequest(url)
                    .then(function(html) {
                        popoverElement = $compile(html)(scope);
                        popoverCtrl.addElement(popoverElement);
                    });
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverTemplate
             * @name removePopoverTemplate
             *
             * @description
             * If there is a popover element, it will remove the popover 
             * element from the popover controller and then unset the variable.
             */
            function removePopoverTemplate() {
                if (popoverElement) {
                    popoverCtrl.removeElement(popoverElement);
                    popoverElement = undefined;
                }
            }
        }
    }

})();
