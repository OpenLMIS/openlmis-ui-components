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


(function(){
    "use strict";

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

    // Storing a reference to the last open popover. Is used to close the last
    // open popover when a new one is open. After the previous popover is closed,
    // the new one is registered as the new popover. See compilePopover function
    // for details.
    var lastOpenPopover;

    angular.module('openlmis-popover')
    .directive('popover', popoverDirective);

    popoverDirective.$inject = ['$compile', '$timeout', '$templateRequest','$rootScope', '$window'];

    function popoverDirective($compile, $timeout, $templateRequest, $rootScope, $window){
        return {
            restrict: 'A',
            controller: 'PopoverController',
            require: 'popover',
            link: popoverLink
        };

        function popoverLink(scope, element, attrs, popoverCtrl) {
            // Scope used to render template frame
            // set to persist and accept values from other items
            var popoverScope = scope.$new(true);

            var popoverConfig = {
                container: 'body',
                placement: 'auto top',
                html: true,
                trigger: 'manual'
            };

            makePopover();

            // NOTE:
            // Anytime we open a popover, a process starts that will try to
            // close the popover
            element.on('focus', openPopover);
            element.on('focusin', openPopover);
            element.on('mouseover', openPopover);

            element.on('blur', closePopover);
            element.on('mouseout', closePopover);

            element.on('$destroy', function() {
                destroyPopover();
                popoverScope.$destroy();
            });

            /**
             * @ngdoc property
             * @propertyOf openlmis-popover.directive:popover
             * @name popoverTitle
             * @type {String}
             *
             * @description
             * Displayed title for the popover. The title is removed if the
             * string is empty.
             */
            scope.$watch(function(){
                return attrs['popoverTitle'];
            }, function(title){
                if(title && title != ''){
                    popoverScope.title = title;
                } else {
                    popoverScope.title = false;
                }
            });

            /**
             * @ngdoc property
             * @propertyOf openlmis-popover.directive:popover
             * @name popoverClass
             * @type {String}
             *
             * @description
             * Additional classes that are applied to the popover. This must be
             * a string, with different classes separated by a space.
             */
            scope.$watch(function(){
                return attrs['popoverClass'];
            }, function(cssClass){
                popoverScope.cssClass = cssClass;
            });


            var popoverHasElements,
                popoverCanOpen;

            scope.$watch(function(){
                return popoverCtrl.getElements().length > 0;
            }, function(hasElements){
                if(hasElements) {
                    popoverHasElements = true;
                    realOpenPopover();
                } else {
                    popoverHasElements = false;
                    realClosePopover();
                }
            });

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name openPopover
             *
             * @description
             * Opens the popover, if there are elements to show.
             */
            function openPopover() {
                popoverCanOpen = true;
                realOpenPopover();
            }

            var popoverIsOpen;
            function realOpenPopover() {
                if(popoverHasElements && popoverCanOpen && !popoverIsOpen) {
                    popoverIsOpen = true;
                    element.popover('show');
                    watchToClosePopover();
                }
            }

            function watchToClosePopover() {
                angular.element('body').on('focusin', checkClose);
                angular.element('body').on('mouseover', checkClose);
                angular.element('body').on('click', checkClose);
            }

            function checkClose(event) {
                var target = angular.element(event.target),
                    isContainedByElement = containedByElement(event.target),
                    inPopover = target.parents('.popover').length > 0 || target.hasClass('popover'),
                    isFocused = element.hasClass('is-focused') || element.is(':focus') || element.find(':focus').length > 0 || element.find('.is-focused').length > 0;

                if(!isContainedByElement && !inPopover && !isFocused) {
                    closePopover();
                } else {
                    cancelClose();
                }
            }

            function containedByElement(target) {
                var isContainedByElement = false;

                target = angular.element(target[0]); // not sure why needed

                if(target[0] === element[0]) {
                    isContainedByElement = true;
                } else {
                    target.parents().each(function(index, targetParent){
                        if(targetParent === element[0]){
                            isContainedByElement = true;
                        }
                    });
                }

                return isContainedByElement;
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name closePopover
             *
             * @description
             * Closes the popover.
             */
            var closeTimeout;
            function cancelClose(){
                if(closeTimeout) {
                    $timeout.cancel(closeTimeout);
                    closeTimeout = undefined;
                }
            }

            function closePopover() {
                cancelClose();
                closeTimeout = $timeout(realClosePopover, 250);
            }

            function realClosePopover() {
                angular.element('body').off('focusin', checkClose);
                element.popover('hide');
                popoverIsOpen = false;
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name compilePopover
             *
             * @description
             * Creates the popover and it responsible for compiling elements
             * that are shown within the popover.
             */
            function compilePopover(){
                // Popover requires this gets set...
                var tabIndex = element.attr('tabindex');
                element.attr('tabindex', tabIndex || 0);

                // Added to close button in popover template
                popoverScope.closePopover = function(){
                    realClosePopover();
                };

                // Added to be able to open popover after closing it with close
                // button when trigger is set to 'click'
                // After clicking close button there was need to click on
                // targetElement two times to open popover again
                element.on('hide.bs.popover', function(){
                    element.data("bs.popover").inState.click = false;
                });

                element.on('show.bs.popover', function(){
                    if(lastOpenPopover && lastOpenPopover != element){
                        lastOpenPopover.popover('hide');
                    }
                    lastOpenPopover = element;
                });

                $templateRequest('openlmis-popover/popover.html').then(function(templateHtml){
                    var template = $compile(templateHtml)(popoverScope);
                    popoverConfig.template = template;

                    popoverConfig.content = function() {
                        var elements = [];
                        popoverCtrl.getElements().forEach(function(element){
                            elements.push(element[0]);
                        });
                        return elements;
                    }

                    element.popover(popoverConfig);
                });
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
            function makePopover(){
                element.addClass('has-popover');

                angular.element($window).on('resize', onWindowResize);
                angular.element($window).on('scroll', onWindowResize);

                // This should live somewhere else?
                element.parents('.openlmis-flex-table').on('scroll', onWindowResize);

                compilePopover(element);
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
            function destroyPopover(){
                if (lastOpenPopover == element) lastOpenPopover = null;
                element.removeClass('has-popover');
                element.children('.show-popover').remove();
                angular.element($window).off('resize', onWindowResize);
            }

            function onWindowResize(){
                realClosePopover();
            }
        }
    }

})();
