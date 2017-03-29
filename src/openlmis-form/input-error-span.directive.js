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
     * @name openlmis-form.input
     *
     * @description
     * Shows w validation message beneath the input.
     */
    angular
        .module('openlmis-form')
        .directive('input', inputErrorSpan);

    inputErrorSpan.$inject = ['messageService'];

    function inputErrorSpan(messageService) {
        var directive = {
            link: link,
            require: [
                '^?form',
                '?ngModel'
            ],
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, controllers) {
            var formCtrl = controllers[0],
                ngModelCtrl = controllers[1],
                span;

            if (!formCtrl || !ngModelCtrl) return;

            span = angular.element('<span class="error"></span>');
            element.after(span);

            scope.$watch(function() {
                return formCtrl.$submitted;
            }, updateElement);

            scope.$watch(function() {
                return ngModelCtrl.$valid;
            }, updateElement);

            scope.$on('$destroy', function() {
                span = undefined;
            });

            function updateElement() {
                if (!formCtrl.$submitted || ngModelCtrl.$valid) {
                    span.hide();
                } else {
                    span.html(messageService.get('error.' + getError(ngModelCtrl.$error)));
                    span.show();
                }
            }

            function getError(errors) {
                var error;
                angular.forEach(errors, function(value, key) {
                    error = key;
                });
                return error;
            }

        }
    }



})();
