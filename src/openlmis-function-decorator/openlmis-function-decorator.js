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
     * @ngdoc service
     * @name openlmis-function-decorator.FunctionDecorator
     *
     * @description
     * Provides methods for decorating function with successful notification, error notifications and loading.
     */
    angular
        .module('openlmis-function-decorator')
        .factory('FunctionDecorator', FunctionDecorator);

    FunctionDecorator.$inject = ['loadingModalService', 'notificationService', '$q', 'confirmService'];

    function FunctionDecorator(loadingModalService, notificationService, $q, confirmService) {

        FunctionDecorator.prototype.decorateFunction = decorateFunction;
        FunctionDecorator.prototype.withLoading = withLoading;
        FunctionDecorator.prototype.withSuccessNotification = withSuccessNotification;
        FunctionDecorator.prototype.withErrorNotification = withErrorNotification;
        FunctionDecorator.prototype.getDecoratedFunction = getDecoratedFunction;
        FunctionDecorator.prototype.withConfirm = withConfirm;

        return FunctionDecorator;

        function FunctionDecorator() {}

        /**
         * @ngdoc method
         * @methodOf openlmis-function-decorator.FunctionDecorator
         * @name decorateFunction
         *
         * @description
         * Specifies the function to decorate.
         *
         * @param {Function}           fn  the function to decorate
         * @return {FunctionDecorator}     this instance of the Function Decorator
         */
        function decorateFunction(fn) {
            this.fn = fn;
            return this;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-function-decorator.FunctionDecorator
         * @name withLoading
         *
         * @description
         * Decorates the function with loading. This decoration is transparent, meaning it won't change the function and
         * returned promise behaviors.
         *
         * @param {bool}               leaveOpen  flag defining whether loading modal should stay open after resolving
         *                                        the promise returned by the decorated method.
         * @return {FunctionDecorator}            this instance of the Function Decorator
         */
        function withLoading(leaveOpen) {
            var originalFn = this.fn;
            this.fn = function() {
                loadingModalService.open();

                var promise = originalFn.apply(undefined, arguments);

                if (!leaveOpen) {
                    promise = promise.then(function(result) {
                        loadingModalService.close();
                        return result;
                    });
                }

                return promise
                    .catch(function(error) {
                        loadingModalService.close();
                        return $q.reject(error);
                    });
            };

            return this;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-function-decorator.FunctionDecorator
         * @name withSuccessNotification
         *
         * @description
         * Decorates the function with successful notification after the original function resolves its promise. This
         * decoration is transparent, meaning it won't change the function and returned promise behaviors.
         *
         * @param {Function}           fn              the function to decorate
         * @param {string}             successMessage  the success message to display
         * @return {FunctionDecorator}                 this instance of the Function Decorator
         */
        function withSuccessNotification(successMessage) {
            var originalFn = this.fn;
            this.fn = function() {
                return originalFn.apply(undefined, arguments)
                    .then(function(result) {
                        notificationService.success(successMessage);
                        return result;
                    });
            };
            return this;

        }

        /**
         * @ngdoc method
         * @methodOf openlmis-function-decorator.FunctionDecorator
         * @name withErrorNotification
         *
         * @description
         * Decorates the function with error notification after the original function rejects its promise. This
         * decoration is transparent, meaning it won't change the function and returned promise behaviors.
         *
         * @param {Function}           fn            the function to decorate
         * @param {string}             errorMessage  the error message to display
         * @return {FunctionDecorator}               this instance of the Function Decorator
         */
        function withErrorNotification(errorMessage) {
            var originalFn = this.fn;
            this.fn = function() {
                return originalFn.apply(undefined, arguments)
                    .catch(function(error) {
                        notificationService.error(errorMessage);
                        return $q.reject(error);
                    });
            };
            return this;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-function-decorator.FunctionDecorator
         * @name withConfirm
         *
         * @description
         * Decorates the function with corfirm service before the original function resolves its promise. This
         * decoration is transparent, meaning it won't change the function and returned promise behaviors.
         *
         * @param {Function}           fn              the function to decorate
         * @param {string}             confirmMessage  the confirm message to display
         * @return {FunctionDecorator}                 this instance of the Function Decorator
         */
        function withConfirm(confirmMessage) {
            var originalFn = this.fn;
            this.fn = function() {
                var args = arguments;
                return confirmService.confirm(confirmMessage)
                    .then(function() {
                        return originalFn.apply(undefined, args);
                    });
            };
            return this;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-function-decorator.FunctionDecorator
         * @name getDecoratedFunction
         *
         * @description
         * Returns the decorated function.
         *
         * @return {Function}  the decorated function
         */
        function getDecoratedFunction() {
            return this.fn;
        }

    }

})();