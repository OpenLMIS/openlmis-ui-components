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
     * @name openlmis-table-form.directive:trOpenlmisInvalid
     *
     * @description
     * Sets the invalidCtrl to 'hidden' until the TR has recieved focus once, and
     * subsequently lost it.
     *
     * The table row will also show errors if a containing form control is in
     * the $submitted state, or a openlmis-form-submit event is sent through
     * the scope.
     */

    angular
        .module('openlmis-table-form')
        .directive('openlmisInvalid', directive);

    function directive() {
        return {
            link: link,
            restrict: 'A',
            require: ['openlmisInvalid']
        };

        function link(scope, element, attrs, ctrls) {
            if (element.parents('[suppress-tr-openlmis-invalid]').length) {
                return;
            }

            var wasFocused = false,
                openlmisInvalidCtrl = ctrls[0],
                tr = element.parents('tr:first');

            if (tr.length === 0) {
                return;
            }

            openlmisInvalidCtrl.hide();

            scope.$watch(function() {
                return tr.hasClass('is-focused');
            }, function(isFocused) {
                if (isFocused) {
                    wasFocused = true;
                }
                if (!isFocused && wasFocused) {
                    openlmisInvalidCtrl.show();
                }
            });

            scope.$on('openlmis-form-submit', function() {
                openlmisInvalidCtrl.show();
            });
        }
    }

})();
