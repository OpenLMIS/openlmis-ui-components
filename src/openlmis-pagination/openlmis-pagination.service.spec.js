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

describe('paginationService', function() {

    beforeEach(function() {

        module('openlmis-pagination');

        inject(function($injector) {
            this.paginationService = $injector.get('paginationService');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.PAGE_SIZE = $injector.get('PAGE_SIZE');
            this.$state = $injector.get('$state');
        });

        this.goToState = function(to, from) {
            this.$rootScope.$emit('$stateChangeStart', {
                name: to
            }, {
                name: from
            });
        };
    });

    describe('registerUrl', function() {

        beforeEach(function() {
            this.stateParams = {
                page: 1,
                size: 15,
                someParam: 'param'
            };

            this.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            this.totalItems = 20;

            this.goToState('test.state', 'test');

            this.loadItemsSpy = jasmine.createSpy().andReturn(this.$q.when({
                size: this.stateParams.size,
                number: this.stateParams.page,
                totalElements: this.totalItems,
                content: this.items
            }));
            this.promise = this.paginationService.registerUrl(this.stateParams, this.loadItemsSpy);
            this.$rootScope.$apply();

            this.$state.current.name = 'test.state';
        });

        it('should return promise', function() {
            expect(this.promise.then).not.toBe(undefined);
        });

        it('should returned resolved items', function() {
            var resolvedItems;

            this.promise.then(function(response) {
                resolvedItems = response;
            });
            this.$rootScope.$apply();

            expect(resolvedItems).toEqual(this.items);
        });

        it('should set page size', function() {
            expect(this.paginationService.getSize()).toEqual(this.stateParams.size);
        });

        it('should set page number', function() {
            expect(this.paginationService.getPage()).toEqual(this.stateParams.page);
        });

        it('should set total items', function() {
            expect(this.paginationService.getTotalItems()).toEqual(this.totalItems);
        });

        it('should set showing items', function() {
            expect(this.paginationService.getShowingItems()).toEqual(this.items.length);
        });

        it('should set external pagination flag', function() {
            expect(this.paginationService.isExternalPagination()).toBe(true);
        });

        it('should set item validator to null', function() {
            expect(this.paginationService.getItemValidator()).toBeUndefined();
        });

        it('should set page size and number to default one if they are undefined', function() {
            this.paginationService.registerUrl({}, this.loadItemsSpy);
            this.$rootScope.$apply();

            expect(this.loadItemsSpy).toHaveBeenCalledWith({
                page: 0,
                size: this.PAGE_SIZE
            });
        });

        it('should set page number to 0 if state params have changed', function() {
            this.paginationService.registerUrl({
                size: 20,
                page: this.stateParams.page,
                someParam: 'param'
            }, this.loadItemsSpy);
            this.$rootScope.$apply();

            expect(this.loadItemsSpy).toHaveBeenCalledWith({
                page: 0,
                size: 20,
                someParam: 'param'
            });
        });

        it('should set page size to 0 when method does not return promise', function() {
            this.paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            this.$rootScope.$apply();

            expect(this.paginationService.getSize()).toEqual(0);
        });

        it('should set page number to 0 when method does not return promise', function() {
            this.paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            this.$rootScope.$apply();

            expect(this.paginationService.getPage()).toEqual(0);
        });

        it('should set total items to 0 when method does not return promise', function() {
            this.paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            this.$rootScope.$apply();

            expect(this.paginationService.getTotalItems()).toEqual(0);
        });

        it('should set showing items to 0 when method does not return promise', function() {
            this.paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            this.$rootScope.$apply();

            expect(this.paginationService.getShowingItems()).toEqual(0);
        });

        it('should translate custom page parameter if it was given', function() {
            var loadItemsSpy = jasmine.createSpy();

            this.paginationService.registerUrl({
                customPage: 10,
                size: 20
            }, loadItemsSpy, {
                customPageParamName: 'customPage'
            });
            this.$rootScope.$apply();

            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 10,
                size: 20
            });
        });

        it('should translate custom size parameter if it was given', function() {
            var loadItemsSpy = jasmine.createSpy();

            this.paginationService.registerUrl({
                page: 10,
                customSize: 20
            }, loadItemsSpy, {
                customSizeParamName: 'customSize'
            });
            this.$rootScope.$apply();

            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 10,
                size: 20
            });
        });

        it('should init correct page param if custom page parameter name was given', function() {
            var params = {};

            this.paginationService.registerUrl(params, this.loadItemsSpy, {
                customPageParamName: 'customPage'
            });
            this.$rootScope.$apply();

            expect(params.customPage).toBe(0);
        });

        it('should init correct size param if custom size parameter name was given', function() {
            var params = {};

            this.paginationService.registerUrl(params, this.loadItemsSpy, {
                customSizeParamName: 'customSize'
            });
            this.$rootScope.$apply();

            expect(params.customSize).toBe(10);
        });
    });

    describe('registerList', function() {

        var stateParams = {
                page: 1,
                size: 5,
                someParam: 'param'
            },
            items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            loadItemsSpy,
            validator = jasmine.createSpy(),
            promise;

        beforeEach(function() {
            this.goToState('test.state', 'test');
            this.$state.current.name = 'test.state';
            this.$rootScope.$apply();
            loadItemsSpy = jasmine.createSpy().andReturn(items);
            promise = this.paginationService.registerList(validator, stateParams, loadItemsSpy);
            this.$rootScope.$apply();
        });

        it('should return promise', function() {
            expect(promise.then).not.toBe(undefined);
        });

        it('should returned resolved items', function() {
            var resolvedItems;

            promise.then(function(response) {
                resolvedItems = response;
            });
            this.$rootScope.$apply();

            expect(resolvedItems).toEqual(items);
        });

        it('should set page size', function() {
            expect(this.paginationService.getSize()).toEqual(stateParams.size);
        });

        it('should set page number', function() {
            expect(this.paginationService.getPage()).toEqual(stateParams.page);
        });

        it('should set total items', function() {
            expect(this.paginationService.getTotalItems()).toEqual(items.length);
        });

        it('should set external pagination flag', function() {
            expect(this.paginationService.isExternalPagination()).toBe(false);
        });

        it('should set item validator to null', function() {
            expect(this.paginationService.getItemValidator()).toEqual(validator);
        });

        it('should set page size and number to default one if they are undefined', function() {
            this.paginationService.registerUrl({}, loadItemsSpy);
            this.$rootScope.$apply();

            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 0,
                size: this.PAGE_SIZE
            });
        });

        it('should set page number to 0 if state params have changed', function() {
            this.paginationService.registerUrl({
                size: 20,
                page: stateParams.page,
                someParam: 'param'
            }, loadItemsSpy);
            this.$rootScope.$apply();

            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 0,
                size: 20,
                someParam: 'param'
            });
        });
    });

    it('should keep parent state pagination parameters', function() {
        this.goToState('test.state', 'test');

        var paramsOne = {
            page: 1,
            size: 13
        };

        var $q = this.$q;
        this.paginationService.registerUrl(paramsOne, function() {
            return $q.resolve({
                number: 1,
                size: 13,
                totalElements: 26,
                content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            });
        });
        this.$rootScope.$apply();

        this.goToState('test.state.child', 'test.state');

        var paramsTwo = {
            page: 0,
            size: 10
        };
        this.paginationService.registerList(null, paramsTwo, function() {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        });
        this.$rootScope.$apply();

        this.$state.current.name = 'test.state.child';

        expect(this.paginationService.getPage()).toEqual(0);
        expect(this.paginationService.getSize()).toEqual(10);
        expect(this.paginationService.isExternalPagination()).toEqual(false);
        expect(this.paginationService.getTotalItems()).toEqual(20);

        this.goToState('test.state', 'test.state.child');
        this.$state.current.name = 'test.state';

        expect(this.paginationService.getPage()).toEqual(1);
        expect(this.paginationService.getSize()).toEqual(13);
        expect(this.paginationService.getShowingItems()).toEqual(13);
        expect(this.paginationService.isExternalPagination()).toEqual(true);
        expect(this.paginationService.getTotalItems()).toEqual(26);
    });

    it('should clear pagination parameter if going to non-child state', function() {
        this.goToState('test.state', 'test');

        var paramsOne = {
            page: 1,
            size: 13
        };

        var $q = this.$q;
        this.paginationService.registerUrl(paramsOne, function() {
            return $q.resolve({
                number: 1,
                size: 13,
                totalElements: 26,
                content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            });
        });
        this.$rootScope.$apply();

        this.goToState('test.otherState', 'test.state');

        var paramsTwo = {
            page: 2,
            size: 14
        };
        this.paginationService.registerUrl(paramsTwo, function() {
            return $q.resolve({
                number: 2,
                size: 14,
                totalElements: 42,
                content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
            });
        });
        this.$rootScope.$apply();

        this.$state.current.name = 'test.otherState';

        expect(this.paginationService.getPage()).toEqual(2);
        expect(this.paginationService.getSize()).toEqual(14);
        expect(this.paginationService.getShowingItems()).toEqual(14);
        expect(this.paginationService.isExternalPagination()).toEqual(true);
        expect(this.paginationService.getTotalItems()).toEqual(42);

        this.goToState('test.otherState', 'test.state');
        this.$state.current.name = 'test.state';

        expect(this.paginationService.getPage()).toBeUndefined();
        expect(this.paginationService.getSize()).toBeUndefined();
        expect(this.paginationService.getShowingItems()).toBeUndefined();
        expect(this.paginationService.isExternalPagination()).toBeUndefined();
        expect(this.paginationService.getTotalItems()).toBeUndefined();
    });

    it('should clear pagination parameter if going to state parents parent', function() {
        this.goToState('test.state', 'test');

        var paramsOne = {
            page: 1,
            size: 13
        };

        var $q = this.$q;
        this.paginationService.registerUrl(paramsOne, function() {
            return $q.resolve({
                number: 1,
                size: 13,
                totalElements: 26,
                content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            });
        });
        this.$rootScope.$apply();

        this.goToState('test.state.child', 'test.state');

        var paramsTwo = {
            page: 0,
            size: 10
        };
        this.paginationService.registerList(null, paramsTwo, function() {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        });
        this.$rootScope.$apply();

        this.goToState('test.state.child.child', 'test.state.child');

        var paramsThree = {
            page: 2,
            size: 2
        };
        this.paginationService.registerList(null, paramsThree, function() {
            return [1, 2, 3, 4, 5];
        });
        this.$rootScope.$apply();

        this.goToState('test.state', 'test.state.child.child');

        this.$state.current.name = 'test.state.child';

        expect(this.paginationService.getPage()).toBeUndefined();
        expect(this.paginationService.getSize()).toBeUndefined();
        expect(this.paginationService.getShowingItems()).toBeUndefined();
        expect(this.paginationService.isExternalPagination()).toBeUndefined();
        expect(this.paginationService.getTotalItems()).toBeUndefined();

        this.$state.current.name = 'test.state.child.child';

        expect(this.paginationService.getPage()).toBeUndefined();
        expect(this.paginationService.getSize()).toBeUndefined();
        expect(this.paginationService.getShowingItems()).toBeUndefined();
        expect(this.paginationService.isExternalPagination()).toBeUndefined();
        expect(this.paginationService.getTotalItems()).toBeUndefined();
    });

});
