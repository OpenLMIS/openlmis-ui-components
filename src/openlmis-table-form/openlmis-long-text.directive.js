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
     * @name openlmis-table-form.directive:openlmisLongText
     *
     * @description
     * Shared behavior for long free-text fields shown in a constrained table column.
     * Add the `openlmis-long-text` class to opt a field in: it grows horizontally with
     * its content up to the column max-width (set in CSS), then wraps and grows
     * vertically. The class is the single opt-in flag and covers both the editable side
     * (a textarea, resized here) and the read-only side (a span, handled purely by CSS).
     *
     * @example
     * ```
     * <textarea class="openlmis-long-text" ng-model="model"></textarea>
     * <span class="openlmis-long-text">{{model}}</span>
     * ```
     */
    var GHOST_ID = 'openlmisLongTextGhost';
    var GHOST_STYLE = 'display:inline-block;position:absolute;top:0;left:-9999px;' +
        'visibility:hidden;height:0;overflow:hidden;white-space:pre;';
    var MEASURED_PROPERTIES = [
        'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
        'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth', 'boxSizing'
    ];
    angular
        .module('openlmis-table-form')
        .directive('openlmisLongText', openlmisLongText);

    function openlmisLongText() {
        var directive = {
            link: link,
            restrict: 'C'
        };
        return directive;

        // A textarea's size comes from its cols/rows, not its text, so measure the content and
        // set the width and height. (The read-only span does the same purely in CSS.)
        function link(scope, element) {
            var el = element[0];

            if (el.tagName !== 'TEXTAREA') {
                return;
            }

            scope.$watch(function() {
                return el.value;
            }, function() {
                resize(el);
            });
        }

        function resize(el) {
            // Skip while hidden: a display:none textarea has scrollHeight 0, which would stick it
            // at height:0 once shown. Typing re-runs this when it is visible.
            if (el.offsetParent === null) {
                return;
            }
            el.style.width = measureContentWidth(el) + 'px';
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }

        function measureContentWidth(el) {
            var ghost = getGhost();
            var style = window.getComputedStyle(el);

            MEASURED_PROPERTIES.forEach(function(property) {
                ghost.style[property] = style[property];
            });
            ghost.textContent = el.value || el.getAttribute('placeholder') || '';

            // Sub-pixel width rounded up. offsetWidth rounds down and can wrap the last word
            // mid-typing; ceil of the real width is the smallest integer that still fits.
            return Math.ceil(ghost.getBoundingClientRect().width);
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
    }

})();
