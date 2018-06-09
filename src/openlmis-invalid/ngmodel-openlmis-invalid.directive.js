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
     * @name openlmis-invalid.directive:openlmis-invalid-ngmodel
     *
     * @description
     * Watches the openlmis-invalid attribute, and sets the ng-model invalid
     * state if the object has a ng-model controller.
     */

    angular
        .module('openlmis-invalid')
        .directive('openlmisInvalid', directive);

    function directive() {
        return {
            link: link,
            restrict: 'A',
            require: [
                'openlmisInvalid',
                '?ngModel'
            ]
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-invalid.directive:openlmis-invalid-ngmodel
         * @name  link
         *
         * @description
         * Watches the openlmis-invalid attribute, and if there is an attribute
         * with a non-empty string value then it sets the ngModelCtrl value to
         * invalid.
         */
        function link(scope, element, attrs, ctrls) {
            var ngModelCtrl = ctrls[1];

            if (!ngModelCtrl) {
                return ;
            }

            scope.$watch(function() {
                if (attrs.hasOwnProperty('openlmisInvalid') && attrs.openlmisInvalid != '') {
                    return attrs.openlmisInvalid;
                } else {
                    return false;
                }
            }, function(message) {
                if (message) {
                    ngModelCtrl.$setValidity('openlmisInvalid', false);
                    ngModelCtrl.$error.openlmisInvalid = message;
                } else {
                    ngModelCtrl.$setValidity('openlmisInvalid', true);
                }
            });
        }

    }

})();
