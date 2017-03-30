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
     * @name .
     *
     * @description
     * Adds the ability to display error for forms, whose ng-submit method returns promise.
     */
    angular
        .module('openlmis-form')
        .directive('form', directive);

    directive.$inject = ['alertService'];

    function directive(alertService) {
        var directive = {
            link: link,
            require: 'form',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, formCtrl) {
            var ngSubmitPath = attrs.ngSubmit,
                methodScope,
                methodName,
                originalFn;

            if (!ngSubmitPath) return;

            methodScope = getMethodScope(scope, ngSubmitPath);
            methodName = getMethodName(ngSubmitPath);
            originalFn = methodScope[methodName];

            methodScope[methodName] = function() {
                var promise = originalFn.apply(this, arguments);

                if (promise && promise.catch) {
                    promise.catch(handleError);
                }

                return promise;
            };

            scope.$on('$destroy', function() {
                originalFn = undefined;
            });

            function getMethodScope(scope, path) {
                var parts = path.split('.');

                parts.pop();

                var methodScope = scope;
                angular.forEach(parts, function(part) {
                    methodScope = methodScope[part];
                });

                return methodScope;
            }

            function getMethodName(path) {
                return path.split('.').pop().slice(0, -2);
            }

            function handleError(error) {
                if (error.data.messageKey) {
                    alertService.error(error.data.messageKey);
                } else {
                    angular.forEach(error.data, function(message, field) {
                        formCtrl[field].$setValidity(message, false);
                        var stopWatch = scope.$watch(function() {
                            return formCtrl[field].$modelValue;
                        }, function(newValue, oldValue) {
                            if (newValue !== oldValue) {
                                formCtrl[field].$setValidity(message, true);
                                stopWatch();
                            }
                        });
                    });
                }
            }
        }
    }

})();
