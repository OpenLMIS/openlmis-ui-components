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
     * @name openlmis-table.controller:OpenlmisTableStickyCellController
     *
     * @description
     * The sticky table cell controller is responsible for calculating a sticky
     * table cells offset. The offset is calculated by comparing the viewport 
     * and table rectangle objects that are entered in the updatePosition
     * method.
     *
     * How the sticky table cell's position should be calculated is generated
     * in the setup method. 
     */

    angular.module('openlmis-table')
    .controller('OpenlmisTableStickyCellController', controller);

    function controller() {
    	var isStickyLeft,
	        isStickyRight,
	        isStickyTop,
	        isStickyBottom;

	    this.setup = setup;
		this.updatePosition = updatePosition;

		/**
		 * @ngdoc method
		 * @name  setup
		 * @methodOf openlmis-table.controller:OpenlmisTableStickyCellController
		 *
		 * @description
		 * Takes a configuration object, and sets internal configuration
		 * variables.
		 *
		 * The configuration object should look like:
		 * ```
		 * {
		 *   stickBottom: true,
		 *   stickLeft: true,
		 *   stickRight: false,
		 *   stickTop: false
		 * }
		 * ```
		 * 
		 * @param  {Object} config Configuration object
		 */
		function setup(config) {
			if(config.stickLeft) {
				isStickyLeft = true;
			}
			if(config.stickRight) {
				isStickyRight = true;
			}
			if(config.stickTop) {
				isStickyTop = true;
			}
			if(config.stickBottom) {
				isStickyBottom = true;
			}
		}

		/**
		 * @ngdoc method
		 * @name  updatePosition
		 * @methodOf openlmis-table.controller:OpenlmisTableStickyCellController
		 *
		 * @description
		 * Takes rectangle objects for the viewport and table elements, and
		 * then figures out which offset positions need to be caluclated for
		 * the element.
		 * 
		 * @param  {[type]} viewport [description]
		 * @param  {[type]} table    [description]
		 */
		function updatePosition(viewport, table) {
			var position = {
				left: 0,
				top: 0
			};

			if(isStickyLeft) {
				position.left = getLeftOffset(viewport, table);
			}
			if(isStickyRight) {
				position.left = getRightOffset(viewport, table);
			}
			if(isStickyBottom) {
				position.top = getBottomOffset(viewport, table);
			}
			if(isStickyTop) {
				position.top = getTopOffset(viewport, table);
			}

			// Make sure position values are valid, otherwise make zero
			if(!position.left) {
				position.left = 0;
			}
			if(!position.top) {
				position.top = 0;
			}

			return position;
		};

		function getLeftOffset(viewport, table) {
            return viewport.left;
		}

		function getTopOffset(viewport, table) {
            return viewport.top;
		}

		function getRightOffset(viewport, table) {
			if(viewport.width > table.width) {
				return 0;
			}
			return (viewport.left + viewport.width) - table.width;
		}

		function getBottomOffset(viewport, table) {
			if(viewport.height > table.height) {
				return 0;
			}
			return (viewport.top + viewport.height) - table.height;
		}

    }

})();