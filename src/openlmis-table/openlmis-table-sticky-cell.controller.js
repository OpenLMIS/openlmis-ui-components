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
    .controller('OpenlmisTableStickyCellController', controller);

    function controller() {
    	var isStickyLeft,
	        isStickyRight,
	        isStickyTop,
	        isStickyBottom;

	    this.setup = setup;
		this.updatePosition = updatePosition;

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

		function updatePosition(viewport, table) {
			return {
				left: getLeftOffset(viewport, table),
				top: getTopOffset(viewport, table)
			}
		};

		function getLeftOffset(viewport, table) {
	    	if(isStickyRight) {
	    		return getStickyRightOffset(viewport, table);
	    	}

            if(isStickyLeft) {
	            return viewport.left;
            }

	        return 0;
		}

		function getTopOffset(viewport, table) {
	        if(isStickyTop) {
	            return viewport.top;
	        }

	        if(isStickyBottom) {
	            return getStickyBottomOffset(viewport, table);
	        }

	        return 0;
		}

		function getStickyRightOffset(viewport, table) {
			if(viewport.width > table.width) {
				return 0;
			}

			return (viewport.left + viewport.width) - table.width;
		}

		function getStickyBottomOffset(viewport, table) {
			if(viewport.height > table.height) {
				return 0;
			}

			return (viewport.top + viewport.height) - table.height;
		}

    }

})();