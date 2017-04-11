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
     * @name openlmis-form.directive:openlmisDatepicker
     *
     * @description
     * Directive allows to add date picker input.
     *
     * @example
     * To make this directive work only 'value' attribute is required, however there are more attributes to use.
     * In order to make datepicker input use id you can add 'input-id' attribute.
     * The 'change-method' attribute takes function that will be executed after datepicker value change.
     * Datepicker directive also can take max-date and min-date attributes. Their values can be set from other datepickers or manually.
     * ```
     * <openlmis-datepicker
     * 	   value="startDate"
     *     input-id="datepicker-id"
     *     change-method="afterChange()"
     *     min-date="10/05/2016"
     *     max-date="endDate">
     * </openlmis-datepicker>
     *
     * <openlmis-datepicker
     * 	   value="endDate">
     * </openlmis-datepicker>
     * ```
     */
	angular
		.module('openlmis-form')
		.directive('openlmisDatepicker', datepicker);

	datepicker.$inject = ['$filter'];

	function datepicker($filter) {
        return {
            restrict: 'E',
            scope: {
                value: '=',
                inputId: '@?',
                minDate: '=?',
                maxDate: '=?',
                changeMethod: '=?',
                dateFormat: '=?'
            },
            templateUrl: 'openlmis-form/openlmis-datepicker.html',
            controller: 'OpenlmisDatepickerController',
            controllerAs: 'vm',
            link: link
        };

        function link(scope, element, attrs) {

            scope.$watch('value', function() {
                scope.dateString = $filter('openlmisDate')(scope.value);
            });

            scope.clearSelection = function() {
                scope.value = undefined;
                scope.closePopover();
            };
        }
	}

})();
