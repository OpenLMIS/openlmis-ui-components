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
     * @ngdoc service
     * @name openlmis-form.directive:savingIndicator
     *
     * @description
     * Displays a object that indicates if object is saving or is already saved.
     * Component requires scope to set watcher on and object that will be watched for changes.
     *
     * @example
     * ```
     * <saving-indicator
     * 	   scope="scope"
	 *	   object="someObject">
     * <openlmis-pagination/>
     * ```
     */
	angular
		.module('openlmis-form')
		.directive('savingIndicator', directive);

	function directive() {
        return {
            restrict: 'E',
            scope: {
			    object: '='
            },
			controller: 'SavingIndicatorController',
			controllerAs: 'indicator',
            templateUrl: 'openlmis-form/saving-indicator.html'
        };
	}
})();
