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
     * @name openlmis-form.directive:openlmis-invalid
     *
     * @description
     * Sets the invalid error state and message on a form or form control
     * object.
     *
     */
    
    angular
        .module('openlmis-form')
        .directive('openlmisInvalid', directive);

    function directive() {
        var directive = {
            link: link,
            restrict: 'A',
            require: [
                '^?form',
                '^?ngModel'
            ]
        };
        return directive;
    }

    function link(scope, element, attrs, ctrls) {
        var formCtrl = ctrls[0],
            ngModelCtrl = ctrls[1],
            currentErrorMessage;

        scope.$watch(function(){
            if(attrs['openlmisInvalid'] != '') {
                return attrs['openlmisInvalid'];
            } else {
                return false;
            }
        }, function(message) {
            if(!message){
                clearError();
            } else {
                setError(message);
            }
        });

        function setError(errorMessage) {
            currentErrorMessage = errorMessage;
            if (ngModelCtrl) {
                ngModelCtrl.$setValidity(currentErrorMessage, false);
            }
            if (formCtrl) {
                formCtrl.$setSubmitted();
            }
        }

        function clearError() {
            if(!currentErrorMessage) {
                return;
            }
            if(ngModelCtrl) {
                ngModelCtrl.$setValidity(currentErrorMessage, true);
            }

            currentErrorMessage = false;
        }
    }

})();
