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
     * @name openlmis-popover.directive:popoverInteractions
     *
     * @description
     * Adds focus and hover events to the OpenLMIS Popover.
     *
     * This was split out from popover.directive.js so these interactions are
     * not dependant on how the openlmisPopover is internally implemented.
     */

    angular.module('openlmis-popover')
        .directive('openlmisPopover', popoverDirective);

    popoverDirective.$inject = ['$compile', '$timeout'];

    function popoverDirective($compile, $timeout) {
        return {
            restrict: 'A',
            require: 'openlmisPopover',
            link: popoverLink
        };

        function popoverLink(scope, element, attrs, popoverCtrl) {

            // boolean, if popover is open
            var popoverIsOpen,
                // boolean, if popover element has focus and should be open
                popoverCanOpen;

            element.on('focus', focusedElement);
            element.on('focusin', focusedElement);
            element.on('blur', blurredElement);

            element.on('mouseover', focusedElement);
            element.on('mouseout', blurredElement);

            // Keep track of popover state
            element.on('openlmisPopover.open', function() {
                popoverIsOpen = true;
            });
            element.on('openlmisPopover.close', function() {
                popoverIsOpen = false;
            });

            // We want to stop any later registered actions if the popover has
            // been opened.
            element.on('openlmisPopover.open', cancelPopoverTimeout);
            element.on('openlmisPopover.close', cancelPopoverTimeout);

            // Watching all interactions outside the element, so the popover
            // can be interacted with, since its technically outside the focused
            // element.
            element.on('openlmisPopover.open', registerPopoverListeners);
            element.on('openlmisPopover.close', unregisterPopoverListeners);

            element.on('openlmisPopover.change', checkVisibility);

            popoverCtrl.updateTabIndex = function() {
                if (popoverCtrl.getElements().length > 0) {
                    element.attr('tabindex', 0);
                } else {
                    element.attr('tabindex', -1);
                }
            };

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverInteractions
             * @name openPopover
             *
             * @description
             * Opens the popover, if it is closed.
             */
            function openPopover() {
                if (!popoverIsOpen) {
                    popoverCtrl.open();
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverInteractions
             * @name closePopover
             *
             * @description
             * Closes the popover, if it is open.
             */
            function closePopover() {
                if (popoverIsOpen) {
                    popoverCtrl.close();
                }
            }

            // The following are helper functions used to debounce interactions
            // by 500 milliseconds.
            var popoverTimeout;
            function cancelPopoverTimeout() {
                if (popoverTimeout) {
                    $timeout.cancel(popoverTimeout);
                }
            }

            function setPopoverTimeout(fn) {
                cancelPopoverTimeout();
                popoverTimeout = $timeout(fn, 250);
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverInteractions
             * @name focusedElement
             *
             * @description
             * Sets elementFocus to true, and immedately checks if the popover
             * can be opened.
             */
            function focusedElement() {
                popoverCanOpen = true;
                setPopoverTimeout(checkVisibility);
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverInteractions
             * @name blurredElement
             *
             * @description
             * Sets elementFocus to false, and checks if the popover can be
             * opened after a timeout.
             */
            function blurredElement() {
                popoverCanOpen = false;
                setPopoverTimeout(checkVisibility);
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverInteractions
             * @name checkVisibility
             *
             * @description
             * Checks if the popover should be shown or not
             */
            function checkVisibility() {
                var popoverHasElements = popoverCtrl.getElements().length > 0;

                if (popoverHasElements && popoverCanOpen) {
                    openPopover();
                } else {
                    closePopover();
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverInteractions
             * @name registerPopoverListeners
             *
             * @description
             * Registers listeners to see if the user is interacting outside
             * the scope of the element.
             */
            function registerPopoverListeners() {
                angular.element('body')
                    .on('focusin', bodyFocusHandler);
                angular.element('body')
                    .on('click', bodyFocusHandler);
                angular.element('body')
                    .on('mouseover', bodyFocusHandler);
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popoverInteractions
             * @name unregisterPopoverListeners
             *
             * @description
             * Removes listeners registered in registerPopoverListeners
             */
            function unregisterPopoverListeners() {
                angular.element('body')
                    .off('focusin', bodyFocusHandler);
                angular.element('body')
                    .off('click', bodyFocusHandler);
                angular.element('body')
                    .off('mouseover', bodyFocusHandler);
            }

            function bodyFocusHandler(event) {
                var target = angular.element(event.target);

                if (element[0] === target[0] || isContainedByElement(target)) {
                    focusedElement();
                } else if (target.hasClass('popover') || target.parents('.popover').length > 0) {
                    focusedElement();
                } else {
                    blurredElement();
                }
            }

            function isContainedByElement(target) {
                var isContained = false;

                target.parents()
                    .each(function(index, targetParent) {
                        if (targetParent === element[0]) {
                            isContained = true;
                        }
                    });

                return isContained;
            }
        }
    }

})();
