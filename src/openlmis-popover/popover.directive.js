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
     * @name openlmis-popover.directive:popover
     *
     * @description
     * This directive wraps Bootstrap's popover implementation. See the
     * styleguide documentation for examples of where to apply the popover
     * directive on specific elements.
     *
     * There are two main ways to use this directive, as either a showing a
     * string, or rendering a template into the element's context.
     *
     * If you need to update the title, content, css class, or template in a
     * popover, be sure to write the attribute as a variable, as Angular will
     * not register changes otherwise. See examples for more information.
     *
     * @example
     * ```
     * <button popover="This is a popover">Simple Popover</button>
     * ```
     * A popover with a template will compile the template in the scope of the
     * element it is applied to.
     * ```
     * <button popover-template="/example/popover.html">Complex Popover</button>
     * ```
     * If you want to update the popover content at a different time, pass the
     * string as an angular variable.
     * ```
     * <button popover={{popoverContent}}>Popover</button>
     * ```
     */

    angular.module('openlmis-popover')
        .directive('openlmisPopover', popoverDirective);

    popoverDirective.$inject = ['$compile', '$templateRequest', '$window'];

    function popoverDirective($compile, $templateRequest, $window) {
        return {
            restrict: 'A',
            controller: 'OpenlmisPopoverController',
            require: 'openlmisPopover',
            link: popoverLink
        };

        function popoverLink(scope, element, attrs, popoverCtrl) {

            var popoverConfig = {
                container: 'body',
                placement: 'auto top',
                html: true,
                trigger: 'manual'
            };

            /**
             * @ngdoc property
             * @methodOf openlmis-popover.directive:popover
             * @name popoverScope
             *
             * @description
             * popoverScope is the isolated scope that the popover is rendered
             * in. This scope is exposed to other directives through popover
             * controller.
             */
            var popoverScope = scope.$new(true);
            popoverCtrl.popoverScope = popoverScope;

            makePopover();

            // Added to be able to open popover after closing it with close
            // button when trigger is set to 'click'
            // After clicking close button there was need to click on
            // targetElement two times to open popover again
            element.on('hide.bs.openlmisPopover', function() {
                element.data('bs.openlmisPopover').inState.click = false;
            });

            scope.$on('$destroy', destroyPopover);

            scope.$watchCollection(function() {
                return popoverCtrl.getElements();
            }, function() {
                element.trigger('openlmisPopover.change');
            });

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name addHasPopoverClass
             *
             * @description
             * Adds the class 'hasPopover' to the element if there are any
             * elements registered with the popover controller.
             */
            element.on('openlmisPopover.change', addHasPopoverClass);
            function addHasPopoverClass() {
                if (popoverCtrl.getElements().length > 0) {
                    element.addClass('has-popover');
                } else {
                    element.removeClass('has-popover');
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name updateTabIndex
             *
             * @description
             * Changes the element's tab index to -1 if there are no popover
             * elements registered with the popover controller. Otherwise the
             * element's tab index is set to 0.
             *
             * This function is exposed to the popoverController.
             */
            popoverCtrl.updateTabIndex = updateTabIndex;
            element.on('openlmisPopover.change', function() {
                popoverCtrl.updateTabIndex();
            });

            var originalTabIndex = element.attr('tabindex') || -1;
            function updateTabIndex() {
                if (popoverCtrl.getElements().length > 0) {
                    element.attr('tabindex', 0);
                } else {
                    element.attr('tabindex', originalTabIndex);
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name openPopover
             *
             * @description
             * Opens the popover and triggers openlmisPopover.open.
             *
             * This function is exposed through the popover controller.
             */
            popoverCtrl.open = openPopover;
            function openPopover() {
                element.popover('show');
                element.trigger('openlmisPopover.open');
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name closePopover
             *
             * @description
             * Closes the popover and triggers openlmisPopover.close.
             *
             * This function is exposed through the popover controller.
             */
            popoverCtrl.close = closePopover;
            popoverScope.closePopover = popoverCtrl.close;
            function closePopover() {
                element.popover('hide');
                element.trigger('openlmisPopover.close');
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name makePopover
             *
             * @description
             * Attaches event listeners and extra style to the element and
             * popover.
             */
            function makePopover() {
                $templateRequest('openlmis-popover/popover.html')
                    .then(function(templateHtml) {
                        var template = $compile(templateHtml)(popoverScope);
                        popoverConfig.template = template;

                        popoverConfig.content = function() {
                            var elements = [];
                            popoverCtrl.getElements()
                                .forEach(function(element) {
                                    elements.push(element[0]);
                                });
                            return elements;
                        };

                        element.popover(popoverConfig);
                    });
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name destroyPopover
             *
             * @description
             * Removes the popover and any event listeners or classes added to
             * the original element.
             */
            function destroyPopover() {
                element.popover('destroy');
                popoverScope.$destroy();

                angular.element($window)
                    .off('resize', onWindowResize);
                angular.element($window)
                    .off('scroll', onWindowResize);
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name onWindowResize
             *
             * @description
             * Bootstrap's popover component doesn't do a good job at scrolling
             * with elements on the screen, so we close the popover if there is
             * ever any scrolling.
             */
            element.on('show.bs.popover', function() {
                angular.element($window)
                    .on('resize', onWindowResize);
                angular.element($window)
                    .on('scroll', onWindowResize);
                // This should live somewhere else?
                element.parents('.openlmis-flex-table')
                    .on('scroll', onWindowResize);
            });
            element.on('hide.bs.popover', function() {
                angular.element($window)
                    .off('resize', onWindowResize);
                angular.element($window)
                    .off('scroll', onWindowResize);
                // This should live somewhere else?
                element.parents('.openlmis-flex-table')
                    .off('scroll', onWindowResize);
            });

            var resizeFrameId;
            function onWindowResize() {
                if (resizeFrameId) {
                    $window.cancelAnimationFrame(resizeFrameId);
                }

                resizeFrameId = $window.requestAnimationFrame(closePopover);
            }
        }
    }

})();
