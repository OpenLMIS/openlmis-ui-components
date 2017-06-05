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
     * @name openlmis-form.directive:inputErrorSpan
     *
     * @description
     * Adds support for displaying validation errors to the input element. This directive will
     * attach a span displaying a error based on the ngModelController errors.
     *
     * @example
     * To use this directive simply include the openlmis-form module. It will automatically extend
     * all the input elements that reside inside of the form.
     * ```
     * <form>
     *     <input ng-model="soomeModel" />
     * </form>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('input', inputErrorSpan);

    inputErrorSpan.$inject = ['messageService', 'errorSpanFactory'];

    function inputErrorSpan(messageService, errorSpanFactory) {
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

            if (attrs.type === 'checkbox' || attrs.type === 'radio') {
                var nextElem = element.parents('fieldset').find('legend').next();

                if(nextElem.is('span') && nextElem.hasClass('error')) {
                    span = nextElem;
                } else {
                    span = angular.element('<span class="error"></span>');
                    element.parents('fieldset').find('legend').after(span);
                }
            }

            errorSpanFactory.link(scope, element, attrs, controllers, span);
        }
    }



})();
