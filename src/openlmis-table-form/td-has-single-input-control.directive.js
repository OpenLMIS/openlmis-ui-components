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
     * @name openlmis-table-form.directive:inputControlTD
     *
     * @description
     * Adds input-control class to table cells that include only a single input,
     * and will map that inputs state to the table cell.
     */
    angular
        .module('openlmis-table-form')
        .directive('td', tdFormControl);

    function tdFormControl() {
        return {
            restrict: 'E',
            link: link
        };
    }

    function link(scope, element, attrs) {
        scope.$watchCollection(function() {
            return element.find('[input-control]');
        }, function(singleInputElements){
            if(singleInputElements.length === 1) {
                element.addClass('has-single-input-control');
                element.attr('tabindex', -1);
                suppressInvalidErrorMessages(singleInputElements);
            } else {
                element.removeClass('has-single-input-control');
                element.attr('tabindex', 0);
                unsuppressInvalidErrorMessages(singleInputElements);
            }
        });
    }

    function suppressInvalidErrorMessages(elements) {
        var invalidController = angular.element(elements[0]).controller('openlmisInvalid');
        if(invalidController) {
            invalidController.suppress();
        }
    }

    function unsuppressInvalidErrorMessages(elements) {
        elements.each(function(index, element){
            var invalidController = angular.element(element).controller('openlmisInvalid');
            if(invalidController) {
                invalidController.unsuppress();
            }
        });
    }

})();
