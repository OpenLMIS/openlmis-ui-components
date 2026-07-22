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
     * @name openlmis-table-form.directive:textareaAutoResize
     *
     * @description
     * Adds auto-resize to textarea elements inside table cells. The textarea grows
     * horizontally with its content up to the column max-width (set in CSS); once the
     * content reaches that width it wraps and the textarea grows vertically instead.
     *
     * @example
     * ```
     * <textarea ng-model="model"></textarea>
     * ```
     */
    var GHOST_ID = 'openlmisTextareaAutoResizeGhost';
    var GHOST_STYLE = 'display:inline-block;position:absolute;top:0;left:-9999px;' +
        'visibility:hidden;height:0;overflow:hidden;white-space:pre;';
    var MEASURED_PROPERTIES = [
        'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
        'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth', 'boxSizing'
    ];

    angular
        .module('openlmis-table-form')
        .directive('textarea', textareaAutoResize);

    function textareaAutoResize() {
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element) {
            if (shouldSkipElement(element)) {
                return;
            }

            var el = element[0];
            scope.$watch(function() {
                return el.value;
            }, function() {
                el.style.width = measureContentWidth(el) + 'px';
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            });
        }

        function measureContentWidth(el) {
            var ghost = getGhost();
            var style = window.getComputedStyle(el);

            MEASURED_PROPERTIES.forEach(function(property) {
                ghost.style[property] = style[property];
            });
            ghost.textContent = el.value || el.getAttribute('placeholder') || '';

            return ghost.offsetWidth;
        }

        function getGhost() {
            var ghost = document.getElementById(GHOST_ID);
            if (!ghost) {
                ghost = document.createElement('div');
                ghost.id = GHOST_ID;
                ghost.style.cssText = GHOST_STYLE;
                document.body.appendChild(ghost);
            }
            return ghost;
        }

        function shouldSkipElement(element) {
            return element.parents().length < 2 || isOutsideTd(element);
        }

        function isOutsideTd(element) {
            var parents = element.parents();

            return parents[1].localName !== 'td' || parents[0].localName !== 'div' ||
                !parents[0].classList.contains('input-control');
        }
    }

})();
