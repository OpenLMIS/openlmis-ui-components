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

ddescribe('FunctionDecorator', function() {

    beforeEach(function() {
        module('openlmis-function-decorator');

        inject(function($injector) {
            this.FunctionDecorator = $injector.get('FunctionDecorator');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.notificationService = $injector.get('notificationService');
            this.loadingModalService = $injector.get('loadingModalService');
        });

        this.functionDeferred = this.$q.defer();
        this.successMessage = 'Success Message';
        this.errorMessage = 'Error Message';
        this.resolveValue = 'Some resolved value';
        this.resolveError = 'Some error message';

        var functionDeferred = this.functionDeferred;
        this.fn = function() {
            return functionDeferred.promise;
        };

        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');
        spyOn(this.loadingModalService, 'open');
        spyOn(this.loadingModalService, 'close');
    });

    describe('getDecoratedFunction', function() {

        it('should return original function if no decorations were done', function() {
            expect(new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .getDecoratedFunction()).toBe(this.fn);
        });

        it('should return decorated function if decorations were added', function() {
            expect(new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withLoading()
                .getDecoratedFunction()).not.toBe(this.fn);
        });

    });

    describe('withSuccessNotification', function() {

        it('should show success notification if function resolved successfully', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withSuccessNotification(this.successMessage)
                .getDecoratedFunction();

            decorated();
            this.functionDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith(this.successMessage);
        });

        it('should not change the function resolve behavior', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withSuccessNotification(this.successMessage)
                .getDecoratedFunction();

            var result;
            decorated()
                .then(function(resolveValue) {
                    result = resolveValue;
                });
            this.functionDeferred.resolve(this.resolveValue);
            this.$rootScope.$apply();

            expect(result).toEqual(this.resolveValue);
        });

        it('should not change the function reject behavior', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withSuccessNotification(this.successMessage)
                .getDecoratedFunction();

            var error;
            decorated()
                .catch(function(resolveError) {
                    error = resolveError;
                });
            this.functionDeferred.reject(this.resolveError);
            this.$rootScope.$apply();

            expect(error).toEqual(this.resolveError);
        });

    });

    describe('withErrorNotification', function() {

        it('should show error notification if function rejected', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withErrorNotification(this.errorMessage)
                .getDecoratedFunction();

            decorated();
            this.functionDeferred.reject();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith(this.errorMessage);
        });

        it('should not change the function resolve behavior', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withErrorNotification(this.errorMessage)
                .getDecoratedFunction();

            var result;
            decorated()
                .then(function(resolveValue) {
                    result = resolveValue;
                });
            this.functionDeferred.resolve(this.resolveValue);
            this.$rootScope.$apply();

            expect(result).toEqual(this.resolveValue);
        });

        it('should not change the function reject behavior', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withErrorNotification(this.errorMessage)
                .getDecoratedFunction();

            var error;
            decorated()
                .catch(function(resolveError) {
                    error = resolveError;
                });
            this.functionDeferred.reject(this.resolveError);
            this.$rootScope.$apply();

            expect(error).toEqual(this.resolveError);
        });

    });

    describe('withLoading', function() {

        it('should open loading modal', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withLoading()
                .getDecoratedFunction();

            decorated();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should close loading modal after original function resolves', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withLoading()
                .getDecoratedFunction();

            decorated();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();

            this.functionDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal after original function rejects', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withLoading()
                .getDecoratedFunction();

            decorated();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();

            this.functionDeferred.reject();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should not change the function resolve behavior', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withLoading()
                .getDecoratedFunction();

            var result;
            decorated()
                .then(function(resolveValue) {
                    result = resolveValue;
                });
            this.functionDeferred.resolve(this.resolveValue);
            this.$rootScope.$apply();

            expect(result).toEqual(this.resolveValue);
        });

        it('should not change the function reject behavior', function() {
            var decorated = new this.FunctionDecorator()
                .decorateFunction(this.fn)
                .withLoading()
                .getDecoratedFunction();

            var error;
            decorated()
                .catch(function(resolveError) {
                    error = resolveError;
                });
            this.functionDeferred.reject(this.resolveError);
            this.$rootScope.$apply();

            expect(error).toEqual(this.resolveError);
        });

    });

});