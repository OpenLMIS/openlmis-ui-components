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
     * @name openlmis-form.directive:formValidateSubmit
     *
     * @description
     * Prevents from from submitting invalid forms.
     *
     * @example
     * This directive works for all form elements in application.
     * ```
     * <form></form>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('form', directive);

    directive.$inject = ['$timeout', 'alertService', 'messageService'];
    function directive($timeout, alertService, messageService) {
        var directive = {
            link: link,
            priority: -1,
            require: 'form',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, form) {
            element.on('submit', function(event) {
                if (form.$invalid) {
                    event.stopImmediatePropagation();
                    $timeout(function(){
                        alertService.error(messageService.get('openlmisForm.formInvalid'));
                    }, 10);
                }
            });
        }
    }

})();
