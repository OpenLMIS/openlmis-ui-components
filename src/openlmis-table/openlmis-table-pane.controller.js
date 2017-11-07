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
     * @ngdoc controller
     * @name openlmis-table.controller:OpenlmisTablePaneController
     *
     * @description
     * This controller keeps track of the table and viewport dimentions, and
     * orchestrates updating those dimensions to table cells that are
     * registered to this controller.
     */

    angular.module('openlmis-table')
    .controller('OpenlmisTablePaneController', controller);

    function controller() {
        var stickyCells = [],
            tableRectangle = {},
            viewportRectangle = {};

        this.setScrollLeft = setScrollLeft;

        this.registerStickyCell = registerStickyCell;
        this.unregisterStickyCell = unregisterStickyCell;

        this.updateViewportSize = updateViewportSize;
        this.updateViewportPosition = updateViewportPosition;
        this.updateViewportPadding = updateViewportPadding;

        this.updateTableSize = updateTableSize;

        this.getTableRectangle = getTableRectangle;
        this.getViewportRectangle = getViewportRectangle;

        function getTableRectangle() {
            return _.extend({}, tableRectangle);
        }

        function getViewportRectangle() {
            return _.extend({}, viewportRectangle);
        }

        /**
         * @ngdoc method
         * @name  setScrollLeft
         * @methodOf openlmis-table.controller:OpenlmisTablePaneController
         *
         * @description
         * Empty function to set the scroll position. A directive will register
         * their own function here.
         *
         * @param {Number} number Position to set the scroll left value to
         */
        function setScrollLeft(number) {
            // Placeholder for directive to override
        }

        /**
         * @ngdoc method
         * @name  registerStickyCell
         * @methodOf openlmis-table.controller:OpenlmisTablePaneController
         *
         * @description
         * Registers a cell controller, so that when upateCells is called, the
         * updatePosition method on the cell controller is called.
         * 
         * @param  {Object} cellCtrl Controller for a table cell
         */
        function registerStickyCell(cellCtrl) {
            stickyCells.push(cellCtrl);
        };

        /**
         * @ngdoc method
         * @name  unregisterStickyCell
         * @methodOf openlmis-table.controller:OpenlmisTablePaneController
         *
         * @description
         * Unregisters the cell controller so it won't be called anymore.
         * 
         * @param  {Object} cellCtrl Controller for a table cell
         */
        function unregisterStickyCell(cellCtrl) {
            stickyCells = _.without(stickyCells, cellCtrl);
        };

        
        /**
         * @ngdoc method
         * @name  updateViewportPosition
         * @methodOf openlmis-table.controller:OpenlmisTablePaneController
         *
         * @description
         * Updates the calculated scroll position for the viewport, and then
         * updates all registered sticky cells.
         * 
         * @param {Number} top  Top scroll position for the viewport
         * @param {Number} left Left scroll position for the viewport
         */
        function updateViewportPosition(top, left) {
            _.extend(viewportRectangle, {
                top: top,
                left: left
            });
            updateStickyCells();
        }

        /**
         * @ngdoc method
         * @name  updateViewportPadding
         * @methodOf openlmis-table.controller:OpenlmisTablePaneController
         *
         * @description
         * Updates padding values for the viewport.
         * 
         * @param {Number} left  Left amount of padding on the viewport
         * @param {Number} right Right amount of padding on the viewport
         */
        function updateViewportPadding(left, right) {
            _.extend(viewportRectangle, {
                paddingLeft: left,
                paddingRight: right
            });
        }

        /**
         * @ngdoc method
         * @name  updateViewportSize
         * @methodOf openlmis-table.controller:OpenlmisTablePaneController
         *
         * @description
         * Updates the size of the viewport, then updates all registered sticky
         * columns.
         * 
         * @param  {Number} width  Width of the viewport
         * @param  {Number} height Height of the viewport
         */
        function updateViewportSize(width, height) {
            _.extend(viewportRectangle, {
                width: width,
                height: height
            });
            updateStickyCells();
        }

        /**
         * @ngdoc method
         * @name  updateTableSize
         * @methodOf openlmis-table.controller:OpenlmisTablePaneController
         *
         * @description
         * Updates the size of the table, then updates all registered sticky
         * columns.
         * 
         * @param {Number} width  Width of the table
         * @param {Number} height Height of the table
         */
        function updateTableSize(width, height) {
            _.extend(tableRectangle, {
                width: width,
                height: height
            });
            updateStickyCells();
        }


        function updateStickyCells() {
            stickyCells.forEach(function(cellCtrl) {
                cellCtrl.updatePosition(viewportRectangle, tableRectangle);
            });
        }
    }


})();