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

    // Element types that shouldn't have a button or click events assigned to them
    var NO_BUTTON_ELEMENTS = ['a', 'button', 'select', 'input', 'textarea'];

    // Where the popover will be displayed
    var POPOVER_PLACEMENT = 'auto top';

    // Storing a reference to the last open popover. Is used to close the last
    // open popover when a new one is open. After the previous popover is closed,
    // the new one is registered as the new popover. See compilePopover function
    // for details.
    var lastOpenPopover;


    angular.module('openlmis-popover')
    .directive('popover', popoverDirective);

    popoverDirective.$inject = ['jQuery', '$compile', '$timeout', '$templateRequest', '$rootScope', '$window'];
    function popoverDirective(jQuery, $compile, $timeout, $templateRequest, $rootScope, $window){
        return {
            restrict: 'A',
            link: popoverLink
        };


        /**
         * @ngdoc method
         * @methodOf openlmis-popover.directive:popover
         * @name link
         *
         * @description
         * Link function for the directive, which sets up items and attributes.
         *
         * *Most importantly* the popover will be removed if either popover or
         * popover-temple attributes are set to empty strings.
         */
        function popoverLink(scope, element, attrs) {
            // Scope used to render template frame
            // set to persist and accept values from other items
            var templateScope = $rootScope.$new();

            // The element that has popover applied to it (might be a button)
            var targetElement;

            /**
             * @ngdoc property
             * @propertyOf openlmis-popover.directive:popover
             * @name popoverTemplate
             * @type {String}
             *
             * @description
             * A url to a template that will be compiled in the element's
             * scope, then placed inside the popover-content.
             */
            scope.$watch(function(){
                if(attrs.popover && attrs.popover != ''){
                    return attrs.popover;
                } else if(attrs.popoverTemplate && attrs.popoverTemplate != ''){
                    return attrs.popoverTemplate;
                } else {
                    return false;
                }
            }, function(popover){
                if(popover){
                    makePopover();
                } else {
                    destroyPopover();
                }
            });

            element.on('$destroy', function() {
                if (lastOpenPopover == targetElement) lastOpenPopover = undefined;
                destroyPopover();
                targetElement = undefined;
                jQuery($window).off('resize', onWindowResize);
                jQuery($window).off('scroll', onWindowResize);
                templateScope.$destroy();
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
                    templateScope.title = title;
                } else {
                    templateScope.title = false;
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
                templateScope.cssClass = cssClass;
            });


            /**
             * @ngdoc method
             * @methodOf openlmis-popover.directive:popover
             * @name compilePopover
             *
             * @description
             * Creates the popover and it responsible for compiling elements
             * that are shown within the popover.
             */
            function compilePopover(el){
                // Using the popover element will require jQuery.popover
                // which wasn't being automatically included...
                targetElement = jQuery(el);

                // Popover requires this gets set...
                targetElement.attr('tabindex', 0);

                // Added to close button in popover template
                templateScope.closePopover = function(){
                    targetElement.popover('hide');
                }

                targetElement.on('show.bs.popover', function(){
                    if(lastOpenPopover && lastOpenPopover != targetElement){
                        lastOpenPopover.popover('hide');
                    }
                    lastOpenPopover = targetElement;
                });

                jQuery($window).on('resize', onWindowResize);
                jQuery($window).on('scroll', onWindowResize);
                element.parents('.openlmis-flex-table').on('scroll', onWindowResize);


                $templateRequest('openlmis-popover/popover.html').then(function(templateHtml){
                    var template = $compile(templateHtml)(templateScope);

                    var trigger = 'hover focus';

                    if(element.is(NO_BUTTON_ELEMENTS.join(', '))){
                        trigger = 'hover focus';
                    }

                    var popoverConfig = {
                        template: template,
                        container: 'body',
                        placement: POPOVER_PLACEMENT,
                        trigger: trigger
                    };

                    if(attrs['popoverTemplate']){
                        $templateRequest(attrs['popoverTemplate']).then(function(html){
                            var compiledElement = $compile(html)(scope);
                            popoverConfig.content = compiledElement;
                            popoverConfig.html = true;

                            targetElement.popover(popoverConfig);
                        });
                    } else {
                        popoverConfig.content = attrs['popover'];
                        targetElement.popover(popoverConfig);
                    }
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

                if(!element.is(NO_BUTTON_ELEMENTS.join(', '))){
                    $templateRequest('openlmis-popover/popover-button.html').then(function(html){
                        var button = $compile(html)(templateScope);
                        element.append(button);

                        compilePopover(button);
                    });
                } else {
                    compilePopover(element);
                }
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
                element.removeClass('has-popover');
                element.children('.show-popover').remove();
                jQuery($window).off('resize', onWindowResize);
                if (lastOpenPopover == targetElement) lastOpenPopover = null;
                if (targetElement) targetElement.popover('destroy');
            }

            function onWindowResize(){
                if(targetElement){
                    targetElement.popover('hide');
                }
            }
        }
    }

})();
