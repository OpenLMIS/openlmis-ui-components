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

    var paginationService, $q, $rootScope, PAGE_SIZE, $state;

    beforeEach(function() {

        module('openlmis-pagination');

        inject(function($injector) {
            paginationService = $injector.get('paginationService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            PAGE_SIZE = $injector.get('PAGE_SIZE');
            $state = $injector.get('$state');
        });
    });

    describe('registerUrl', function() {

        var stateParams = {
                page: 1,
                size: 15,
                someParam: 'param'
            },
            items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            totalItems = 20,
            loadItemsSpy,
            promise;

        beforeEach(function() {
            goToState('test.state', 'test');

            loadItemsSpy = jasmine.createSpy().andReturn($q.when({
                size: stateParams.size,
                number: stateParams.page,
                totalElements: totalItems,
                content: items
            }));
            promise = paginationService.registerUrl(stateParams, loadItemsSpy);
            $rootScope.$apply();

            $state.current.name = 'test.state';
        });

        it('should return promise', function() {
            expect(promise.then).not.toBe(undefined);
        });

        it('should returned resolved items', function() {
            var resolvedItems;

            promise.then(function(response) {
                resolvedItems = response;
            });
            $rootScope.$apply();

            expect(resolvedItems).toEqual(items);
        });

        it('should set page size', function() {
            expect(paginationService.getSize()).toEqual(stateParams.size);
        });

        it('should set page number', function() {
            expect(paginationService.getPage()).toEqual(stateParams.page);
        });

        it('should set total items', function() {
            expect(paginationService.getTotalItems()).toEqual(totalItems);
        });

        it('should set showing items', function() {
            expect(paginationService.getShowingItems()).toEqual(items.length);
        });

        it('should set external pagination flag', function() {
            expect(paginationService.isExternalPagination()).toBe(true);
        });

        it('should set item validator to null', function() {
            expect(paginationService.getItemValidator()).toBeUndefined();
        });

        it('should set page size and number to default one if they are undefined', function() {
            paginationService.registerUrl({}, loadItemsSpy);
            $rootScope.$apply();
            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 0,
                size: PAGE_SIZE
            });
        });

        it('should set page number to 0 if state params have changed', function() {
            paginationService.registerUrl({
                size: 20,
                page: stateParams.page,
                someParam: 'param'
            }, loadItemsSpy);
            $rootScope.$apply();

            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 0,
                size: 20,
                someParam: 'param'
            });
        });

        it('should set page size to 0 when method does not return promise', function() {
            paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            $rootScope.$apply();
            expect(paginationService.getSize()).toEqual(0);
        });

        it('should set page number to 0 when method does not return promise', function() {
            paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            $rootScope.$apply();
            expect(paginationService.getPage()).toEqual(0);
        });

        it('should set total items to 0 when method does not return promise', function() {
            paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            $rootScope.$apply();
            expect(paginationService.getTotalItems()).toEqual(0);
        });

        it('should set showing items to 0 when method does not return promise', function() {
            paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            $rootScope.$apply();
            expect(paginationService.getShowingItems()).toEqual(0);
        });

        it('should translate custom page parameter if it was given', function() {
            var loadItemsSpy = jasmine.createSpy();

            paginationService.registerUrl({
                customPage: 10,
                size: 20
            }, loadItemsSpy, {
                customPageParamName: 'customPage'
            });
            $rootScope.$apply();

            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 10,
                size: 20
            });
        });

        it('should translate custom size parameter if it was given', function() {
            var loadItemsSpy = jasmine.createSpy();

            paginationService.registerUrl({
                page: 10,
                customSize: 20
            }, loadItemsSpy, {
                customSizeParamName: 'customSize'
            });
            $rootScope.$apply();

            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 10,
                size: 20
            });
        });

        it('should init correct page param if custom page parameter name was given', function() {
            var params = {};

            paginationService.registerUrl(params, loadItemsSpy, {
                customPageParamName: 'customPage'
            });
            $rootScope.$apply();

            expect(params.customPage).toBe(0);
        });

        it('should init correct size param if custom size parameter name was given', function() {
            var params = {};

            paginationService.registerUrl(params, loadItemsSpy, {
                customSizeParamName: 'customSize'
            });
            $rootScope.$apply();

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
            goToState('test.state', 'test');
            $state.current.name = 'test.state';
            $rootScope.$apply();
            loadItemsSpy = jasmine.createSpy().andReturn(items);
            promise = paginationService.registerList(validator, stateParams, loadItemsSpy);
            $rootScope.$apply();
        });

        it('should return promise', function() {
            expect(promise.then).not.toBe(undefined);
        });

        it('should returned resolved items', function() {
            var resolvedItems;

            promise.then(function(response) {
                resolvedItems = response;
            });
            $rootScope.$apply();

            expect(resolvedItems).toEqual(items);
        });

        it('should set page size', function() {
            expect(paginationService.getSize()).toEqual(stateParams.size);
        });

        it('should set page number', function() {
            expect(paginationService.getPage()).toEqual(stateParams.page);
        });

        it('should set total items', function() {
            expect(paginationService.getTotalItems()).toEqual(items.length);
        });

        it('should set external pagination flag', function() {
            expect(paginationService.isExternalPagination()).toBe(false);
        });

        it('should set item validator to null', function() {
            expect(paginationService.getItemValidator()).toEqual(validator);
        });

        it('should set page size and number to default one if they are undefined', function() {
            paginationService.registerUrl({}, loadItemsSpy);
            $rootScope.$apply();
            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 0,
                size: PAGE_SIZE
            });
        });

        it('should set page number to 0 if state params have changed', function() {
            paginationService.registerUrl({
                size: 20,
                page: stateParams.page,
                someParam: 'param'
            }, loadItemsSpy);
            $rootScope.$apply();

            expect(loadItemsSpy).toHaveBeenCalledWith({
                page: 0,
                size: 20,
                someParam: 'param'
            });
        });
    });

    it('should keep parent state pagination parameters', function() {
        goToState('test.state', 'test');

        var paramsOne = {
            page: 1,
            size: 13
        };
        paginationService.registerUrl(paramsOne, function() {
            return $q.resolve({
                number: 1,
                size: 13,
                totalElements: 26,
                content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            });
        });
        $rootScope.$apply();

        goToState('test.state.child', 'test.state');

        var paramsTwo = {
            page: 0,
            size: 10
        };
        paginationService.registerList(null, paramsTwo, function() {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        });
        $rootScope.$apply();

        $state.current.name = 'test.state.child';

        expect(paginationService.getPage()).toEqual(0);
        expect(paginationService.getSize()).toEqual(10);
        expect(paginationService.isExternalPagination()).toEqual(false);
        expect(paginationService.getTotalItems()).toEqual(20);

        goToState('test.state', 'test.state.child');
        $state.current.name = 'test.state';

        expect(paginationService.getPage()).toEqual(1);
        expect(paginationService.getSize()).toEqual(13);
        expect(paginationService.getShowingItems()).toEqual(13);
        expect(paginationService.isExternalPagination()).toEqual(true);
        expect(paginationService.getTotalItems()).toEqual(26);
    });

    it('should clear pagination parameter if going to non-child state', function() {
        goToState('test.state', 'test');

        var paramsOne = {
            page: 1,
            size: 13
        };
        paginationService.registerUrl(paramsOne, function() {
            return $q.resolve({
                number: 1,
                size: 13,
                totalElements: 26,
                content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            });
        });
        $rootScope.$apply();

        goToState('test.otherState', 'test.state');

        var paramsTwo = {
            page: 2,
            size: 14
        };
        paginationService.registerUrl(paramsTwo, function() {
            return $q.resolve({
                number: 2,
                size: 14,
                totalElements: 42,
                content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
            });
        });
        $rootScope.$apply();

        $state.current.name = 'test.otherState';

        expect(paginationService.getPage()).toEqual(2);
        expect(paginationService.getSize()).toEqual(14);
        expect(paginationService.getShowingItems()).toEqual(14);
        expect(paginationService.isExternalPagination()).toEqual(true);
        expect(paginationService.getTotalItems()).toEqual(42);

        goToState('test.otherState', 'test.state');
        $state.current.name = 'test.state';

        expect(paginationService.getPage()).toBeUndefined();
        expect(paginationService.getSize()).toBeUndefined();
        expect(paginationService.getShowingItems()).toBeUndefined();
        expect(paginationService.isExternalPagination()).toBeUndefined();
        expect(paginationService.getTotalItems()).toBeUndefined();
    });

    it('should clear pagination parameter if going to state parents parent', function() {
        goToState('test.state', 'test');

        var paramsOne = {
            page: 1,
            size: 13
        };
        paginationService.registerUrl(paramsOne, function() {
            return $q.resolve({
                number: 1,
                size: 13,
                totalElements: 26,
                content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            });
        });
        $rootScope.$apply();

        goToState('test.state.child', 'test.state');

        var paramsTwo = {
            page: 0,
            size: 10
        };
        paginationService.registerList(null, paramsTwo, function() {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        });
        $rootScope.$apply();

        goToState('test.state.child.child', 'test.state.child');

        var paramsThree = {
            page: 2,
            size: 2
        };
        paginationService.registerList(null, paramsThree, function() {
            return [1, 2, 3, 4, 5];
        });
        $rootScope.$apply();

        goToState('test.state', 'test.state.child.child');

        $state.current.name = 'test.state.child';
        expect(paginationService.getPage()).toBeUndefined();
        expect(paginationService.getSize()).toBeUndefined();
        expect(paginationService.getShowingItems()).toBeUndefined();
        expect(paginationService.isExternalPagination()).toBeUndefined();
        expect(paginationService.getTotalItems()).toBeUndefined();

        $state.current.name = 'test.state.child.child';
        expect(paginationService.getPage()).toBeUndefined();
        expect(paginationService.getSize()).toBeUndefined();
        expect(paginationService.getShowingItems()).toBeUndefined();
        expect(paginationService.isExternalPagination()).toBeUndefined();
        expect(paginationService.getTotalItems()).toBeUndefined();
    });

    function goToState(to, from) {
        $rootScope.$emit('$stateChangeStart', {
            name: to
        }, {
            name: from
        });
    }

});
