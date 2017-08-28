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
     * @name openlmis-form.directive:openlmis-invalid-input-control-child
     *
     * @description
     * When an openlmis-invalid instance is created, it checks to see if there
     * is a parent input-control element it can register to.
     */
    
    angular
        .module('openlmis-form')
        .directive('openlmisInvalid', directive);

    function directive() {
        return {
            link: link,
            restrict: 'A',
            require: 'openlmisInvalid'
        };

        function link(scope, element, attrs, openlmisInvalidCtrl) {
            element.parents('[input-control]:first').each(function(index, parentElement) {
                var parentInvalidCtrl = angular.element(parentElement).controller('openlmisInvalid');
                if(parentInvalidCtrl) {
                    parentInvalidCtrl.registerController(openlmisInvalidCtrl);
                    openlmisInvalidCtrl.suppress();
                }
            });
        }
    }

})();
