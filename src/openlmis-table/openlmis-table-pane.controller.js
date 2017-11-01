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

    angular.module('openlmis-table')
    .controller('OpenlmisTablePaneController', controller);

    function controller() {
        var stickyCells = [],
            tableRectangle = {},
            viewportRectangle = {};

        this.registerStickyCell = registerStickyCell;
        this.unregisterStickyCell = unregisterStickyCell;

        this.updateViewportSize = updateViewportSize;
        this.updateViewportPosition = updateViewportPosition;
        this.updateTableSize = updateTableSize;

        this.updateElements = updateElements;


        function registerStickyCell(cellCtrl) {
            stickyCells.push(cellCtrl);
        };

        
        function unregisterStickyCell(cellCtrl) {
            stickyCells = _.without(stickyCells, cellCtrl);
        };

        
        function updateViewportPosition(top, left) {
            _.extend(viewportRectangle, {
                top: top,
                left: left
            });
            this.updateElements();
        }

        function updateViewportSize(width, height) {
            _.extend(viewportRectangle, {
                width: width,
                height: height
            });
            this.updateElements();
        }

        function updateTableSize(width, height) {
            _.extend(tableRectangle, {
                width: width,
                height: height
            });
            this.updateElements();
        }

        function updateElements() {
            stickyCells.forEach(function(cellCtrl) {
                cellCtrl.updatePosition(viewportRectangle, tableRectangle);
            });
        }
    }


})();