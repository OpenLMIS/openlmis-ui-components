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

    directive.$inject = ['$rootScope'];

    function directive($rootScope) {
        var focusInRow, focusedRow, rows = [];

        return {
            link: link,
            restrict: 'E'
        };

        function link(scope, element) {
            if (!rows.length) {
                angular.element('body')
                    .on('focusin', setSelectedRow)
                    .on('focusout', clearSelectedRowOnLeave);
            }

            if (rows.indexOf(element) === -1) {
                rows.push(element);
            }

            element.on('focusin', setFocusInRow);
            element.on('$destroy', cleanUp);
            scope.$on('$destroy', cleanUp);

            function setFocusInRow() {
                focusInRow = element;
            }

            function cleanUp() {
                element.off('focusin', setFocusInRow);

                if (focusInRow === element) {
                    focusInRow = undefined;
                }

                if (focusedRow === element) {
                    focusedRow = undefined;
                }

                var rowId = rows.indexOf(element);
                if (rowId > -1) {
                    rows.splice(rowId, 1);
                }

                if (!rows.length) {
                    angular.element('body')
                        .off('focusin', setSelectedRow)
                        .off('focusout', clearSelectedRowOnLeave);
                }
            }
        }

        function setSelectedRow() {
            if (focusInRow !== focusedRow && focusedRow) {
                focusedRow.removeClass('is-focused');
            }

            if (focusInRow !== focusedRow) {
                focusedRow = focusInRow;

                if (focusedRow) {
                    focusedRow.addClass('is-focused');
                }
            }

            focusInRow = undefined;
        }

        function clearSelectedRowOnLeave(event) {
            var related = event.relatedTarget ||
                (event.originalEvent && event.originalEvent.relatedTarget);

            // When focus moves to another focusable element a focusin follows and
            // setSelectedRow handles the change. Only act when focus leaves to a
            // non-focusable target (e.g. clicking outside the table), where no
            // focusin fires and the row would otherwise keep the is-focused class.
            if (related) {
                return;
            }

            if (focusedRow) {
                focusedRow.removeClass('is-focused');
                focusedRow = undefined;
                $rootScope.$evalAsync();
            }
        }

    }

})();
