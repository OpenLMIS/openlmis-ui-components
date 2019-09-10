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
     * @restrict A
     * @name openlmis-table-filter.directive:openlmisTableFilter
     *
     * @description
     * Registers the element to the openlmisTableFilters directive making it visible in the filter
     * component popover. It requires openlmisTableFilters directive to be present on one of the
     * ascendants.
     *
     * @example
     * Here's an example of the directive usage:
     * ```
     * <section class="openlmis-table-container">
     *     <div openlmis-table-filter-form>
     *         <label for="exampleFilter">Example</label>
     *         <input id="exampleFilter" type="text" name="example" />
     *     </div>
     * </section>
     * ```
     */
    angular
        .module('openlmis-table-filter')
        .directive('openlmisTableFilterForm', openlmisTableFilterDirective);

    openlmisTableFilterDirective.$inject = [];

    function openlmisTableFilterDirective() {
        var directive = {
            require: '^openlmisTableFilters',
            restrict: 'A',
            link: link
        };
        return directive;

        function link(scope, element, attrs, openlmisTableFiltersCtrl) {
            var container = element.parents().hasClass('modal-content') ? '.modal-content' : 'body';
            openlmisTableFiltersCtrl.registerElement(element, container);
        }
    }

})();
