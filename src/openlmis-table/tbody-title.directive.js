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
     * @name openlmis-table.directive:tbodyTitle
     *
     * @description
     * Takes the title attribute from a tbody element and changes it into a style-able banner.
     *
     * @example
     * To add a title heading to any tbody element, just add a title element with a translated string (this element will
     * not translate strings for you)
     * ```
     * <table>
     *   <tbody tbody-title="Category Title">
     *     <tr><td>123</td><td>456</td></tr>
     *     <tr><td>Foo</td><td>Bar</td></tr>
     *   </tbody>
     * </table>
     * ```
     * Which will produce the following markup
     * ```
     * <table>
     *   <tbody>
     *     <tr class="title"><td colspan="2"><div>Category Title</div></td></tr>
     *     <tr><td>123</td><td>456</td></tr>
     *     <tr><td>Foo</td><td>Bar</td></tr>
     *   </tbody>
     * </table>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('tbody', tbodyTitle);

    tbodyTitle.$inject = ['$compile', '$window', 'jQuery', '$templateCache'];
    function tbodyTitle($compile, $window, jQuery, $templateCache) {

        return {
            restrict: 'E',
            replace: false,
            link: link
        };

        function link(scope, element, attrs) {
            if (attrs.tbodyTitle && attrs.tbodyTitle !== '') {
                var titleScope = scope.$new(true);

                titleScope.title = attrs.tbodyTitle;

                scope.$watch(function() {
                    return element.children('tr:not(.title):first')
                        .children('td, th').length;
                }, function(num) {
                    titleScope.colspan = num;
                });

                var html = $templateCache.get('openlmis-table/tbody-title.html'),
                    titleElement = $compile(html)(titleScope);

                element.prepend(titleElement);

                if (element.parents('.openlmis-table-container').length > 0) {
                    var table = element.parents('table:first');

                    // openlmis-table-container will rewrite table's parent
                    // after this link is run... so we are watching
                    var parent = table.parent();
                    scope.$watch(function() {
                        return table.parent()[0];
                    }, function() {
                        parent.off('scroll', animate);
                        parent = table.parent();
                        parent.on('scroll', animate);
                    });

                    angular.element($window)
                        .bind('resize', animate);

                    element.on('$destroy', function() {
                        parent.off('scroll', animate);
                        angular.element($window)
                            .unbind('resize', animate);
                    });

                    scope.$watch(function() {
                        return jQuery('td, th', table).length;
                    }, animate);

                    angular.element($window)
                        .bind('resize', animate);
                }
            }

            var animationFrameId;
            function animate() {
                if (animationFrameId) {
                    $window.cancelAnimationFrame(animationFrameId);
                }
                animationFrameId = $window.requestAnimationFrame(blit);
            }

            function blit() {
                var expandableElement = titleElement.find('div'),
                    cssUpdate = {};

                var width = getWidthString(expandableElement);
                if (width) {
                    cssUpdate.width = width;
                }

                var offset = table.position().left * -1;
                if (offset + expandableElement.outerWidth() > table.width() + 1) {
                    offset = 0;
                }
                cssUpdate.transform = 'translate3d(' + offset + 'px, 0px, 0px)';

                expandableElement.css(cssUpdate);
            }

            var lastParentWidth;
            function getWidthString(expandableElement) {
                var parentWidth = parent.outerWidth();

                if (parentWidth === lastParentWidth) {
                    return;
                }
                lastParentWidth = parentWidth;

                var colSpan = expandableElement.parent(),
                    widthString = 'calc(' + parentWidth + 'px';

                angular.forEach([
                    'border-left-width',
                    'padding-left',
                    'padding-right',
                    'border-right-width'
                ], function(attr) {
                    if (parseInt(expandableElement.css(attr), 10)) {
                        widthString += ' - ' + expandableElement.css(attr);
                    }
                });

                angular.forEach([
                    'border-left-width',
                    'border-right-width'
                ], function(attr) {
                    if (parseInt(colSpan.css(attr), 10)) {
                        widthString += ' - ' + colSpan.css(attr);
                    }
                });

                return widthString + ')';
            }
        }
    }

})();
