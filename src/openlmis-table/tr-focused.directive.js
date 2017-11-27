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
     * @name openlmis-table.directive:trFocusable
     *
     * @description
     * Watches if the user's focus is in the current table row, and exposes
     * that state through trCtrl.
     *
     */

    angular
        .module('openlmis-table')
        .directive('tr', directive);

    function directive() {
        var focusInRow, focusedRow;

        angular.element('body').on('focusin', function() {
            if (focusInRow !== focusedRow && focusedRow) {
                focusedRow.removeClass('is-focused');
                console.log('Left row');
                console.log(focusedRow);
            }

            if (focusInRow !== focusedRow) {
                focusedRow = focusInRow;

                if (focusedRow) {
                    focusedRow.addClass('is-focused');
                    console.log('Entered row');
                    console.log(focusedRow);
                }
            }

            focusInRow = undefined
        });

        return {
            link: link,
            restrict: 'E'
        };

        function link(scope, element, attrs) {
            element.on('focusin', onFocusIn);

            function onFocusIn() {
                focusInRow = element;
            }
        }

    }

})();
