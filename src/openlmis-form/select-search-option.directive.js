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
     * @name openlmis-form.directive:select-search-option
     *
     * @description
     * Disables select dropdown and displays modal with options and search input.
     * This functionality will be applied to select when there is
     * more than 10 options or it has pop-out attribute.
     *
     * @example
     * ```
     * <select .... pop-out ... > ..... </select>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('select', select);

    select.$inject = ['jQuery', '$q', '$compile', '$templateRequest', 'PAGE_SIZE'];

    function select(jQuery, $q, $compile, $templateRequest, PAGE_SIZE) {
        return {
            restrict: 'E',
            require: ['select', '?ngModel'],
            link: link
        };

        function link(scope, element, attrs, ctrls) {
            var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1],
                popoverScope;

            element.off('click');

            element.on('mousedown', function (event) {
                event.stopPropagation();
                event.preventDefault();
                element.focus();
                openPopover();
            });

            element.bind('keydown', function (event) {
                if([13, 38, 40].indexOf(event.which) > -1) {
                    event.stopPropagation();
                    event.preventDefault();
                    element.focus();
                    openPopover();
                }
            });

            popoverScope = scope.$new();
            popoverScope.PAGE_SIZE = PAGE_SIZE;
            popoverScope.cssClass = 'select-popover';
            popoverScope.closePopover = closePopover;
            popoverScope.select = selectOption;

            updatePopoverScope();
            
            $q.all({
                'templateHtml': $templateRequest('openlmis-popover/popover.html'),
                'html': $templateRequest('openlmis-form/select-search-option.html')
            }).then(function(response){
                var templateHtml = response['templateHtml'],
                    html = response['html'];
                
                element.popover({
                    template: $compile(templateHtml)(popoverScope),
                    content: $compile(html)(popoverScope),
                    html: true,
                    container: 'body',
                    placement: 'bottom',
                    trigger: 'manual'
                });
            });


            /**
             * @ngdoc method
             * @propertyOf openlmis-form.directive:select-search-option
             * @name openPopover
             *
             * @description
             * Creates and displays a new search popover which is generated
             * from the select element. This function registers the event
             * listener that will later call closePopover.
             */
            function openPopover() {
                if(element.attr('disabled')){
                    return ;
                }

                if (element.hasClass('has-popover')) {
                    closePopover();
                    return ;
                }

                updatePopoverScope();
                popoverScope.$digest();
                element.popover('show');

                jQuery('body').on('click focusin', closeListener);

                jQuery('.popover legend:last').focus();
                element.addClass('is-focused');
                element.addClass('has-popover');
                
            }

            /**
             * @ngdoc method
             * @propertyOf openlmis-form.directive:select-search-option
             * @name closePopover
             *
             * @description
             * Closes the popover, unregistering all listenters and destroying
             * the popover's scope.
             */
            function closePopover() {
                jQuery('body').off('click focusin', closeListener);

                element.removeClass('is-focused');
                element.removeClass('has-popover');
                
                element.popover('hide');
                element.focus();
            }

            /**
             * @ngdoc method
             * @propertyOf openlmis-form.directive:select-search-option
             * @name closeListener
             *
             * @description
             * Is called on any focus or click events once openPopover is
             * called. If the click event is not on the select element or a 
             * section of the popover, closePopover is called.
             *
             * This listener doesn't stop any event from happening.
             * 
             */
            function closeListener(event){
                var target = jQuery(event.target);
                if(target.hasClass('bootbox')){    // This is a bug..
                    return ;
                }
                if( target[0] != element[0] && !target.hasClass('popover') && target.parents('.popover').length == 0) {
                    closePopover();
                }
            }

            /**
             * @ngdoc method
             * @propertyOf openlmis-form.directive:select-search-option
             * @name selectOption
             *
             * @description
             * Sets a value to the select element and then immedately closes
             * the popover.
             * 
             */
            function selectOption(value) {
                element.val(value);
                if(ngModelCtrl){
                    ngModelCtrl.$setViewValue(selectCtrl.readValue());
                }
                
                closePopover();
            }

            /**
             * @ngdoc method
             * @propertyOf openlmis-form.directive:select-search-option
             * @name updatePopoverScope
             *
             * @description
             * Reads information from the select element to create the
             * searchable popover element. All information is stored in
             * the popoverScope, which is destroyed with closePopover.
             */
            function updatePopoverScope() {
                
                // Find title from elements ID (mainly for screen readers)
                if(element && element.attr('id') ){ // Added statement because Karma complained....
                    var title = jQuery('label[for="' + element.attr('id') + '"').text();
                    if(title && title != '') {
                        popoverScope.title = title;
                    }
                }

                // Add in options
                popoverScope.options = [];
                popoverScope.selectedValue = false;
                angular.forEach(element.children('option:not(.placeholder)'), function(option) {
                    popoverScope.options.push({
                        label: option.label,
                        value: option.value,
                        selected: option.selected
                    });
                });

                // Reset search text
                popoverScope.searchText = '';

                // Add CSS class that will show/hide the search form
                if(popoverScope.options.length > PAGE_SIZE) {
                    popoverScope.cssClass = 'select-popover select-popover-search';
                } else {
                    popoverScope.cssClass = 'select-popover'
                }
            }
        }
    }
})();
