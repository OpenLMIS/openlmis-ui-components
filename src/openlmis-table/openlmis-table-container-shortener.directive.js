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
     * @restrict C
     * @name openlmis-table.directive:openlmisTableContainerHorizontalScroll
     *
     * @description
     * Adds a fake horizontal scroll bar to the table container
     *
     */
    angular
        .module('openlmis-table')
        .directive('openlmisTableContainer', directive);

    directive.$inject = ['jQuery', '$window'];

    function directive(jQuery, $window) {
        var directive = {
            link: link,
            restrict: 'C',
            priority: 15
        };
        return directive;

        function link(scope, element) {
            var xScrollbar,
                flexTable,
                window = jQuery($window);

            flexTable = jQuery('.openlmis-flex-table', element);

            window.ready(function() {
                if (flexTable.length > 0) {
                    $(flexTable[0]).perfectScrollbar({
                        handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
                        surpressScrollY: true,
                        wheelPropagation: true
                    });
                    xScrollbar = jQuery('.ps-scrollbar-x-rail', element);
                }
            });

            window.on('scroll', blit);
            window.on('resize', update);

            element.on('$destroy', function() {
                window.off('resize', update);
                window.off('scroll', blit);
            });

            function update() {
                if (flexTable.length > 0) {
                    $(flexTable[0]).perfectScrollbar('update');
                    blit();
                }
            }

            function blit() {
                if (xScrollbar) {
                    var parent = xScrollbar.parent();
                    var windowHeight = window.height(),
                        containerOffset = parent[0].getBoundingClientRect().bottom;

                    // remove height of floating toolbar
                    jQuery('.openlmis-toolbar')
                        .each(function() {
                            var div = jQuery(this);
                            containerOffset += div.outerHeight();
                        });

                    if (containerOffset < windowHeight) {
                        xScrollbar[0].style.setProperty('--bottom-offset', 0);
                        return;
                    }

                    xScrollbar[0].style.setProperty('--bottom-offset', (containerOffset - windowHeight));
                }
            }
        }
    }

})();
