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

    var paginationService, $q, $rootScope, PAGE_SIZE;

    beforeEach(function() {

        module('openlmis-pagination');

        inject(function($injector) {
            paginationService = $injector.get('paginationService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            PAGE_SIZE = $injector.get('PAGE_SIZE');
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
            loadItemsFromAPI,
            promise;

        beforeEach(function() {
            loadItemsFromAPI = jasmine.createSpy().andReturn($q.when({
                size: stateParams.size,
                number: stateParams.page,
                totalElements: totalItems,
                content: items
            }));
            promise = paginationService.registerUrl(stateParams, loadItemsFromAPI);
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
            expect(paginationService.getTotalItems()).toEqual(totalItems);
        });

        it('should set showing items', function() {
            expect(paginationService.getShowingItems()).toEqual(items.length);
        });

        it('should set external pagination flag', function() {
            expect(paginationService.isExternalPagination()).toBe(true);
        });

        it('should set item validator to null', function() {
            expect(paginationService.itemValidator).toEqual(null);
        });

        it('should set page size and number to default one if they are undefined', function() {
            paginationService.registerUrl({}, loadItemsFromAPI);
            $rootScope.$apply();
            expect(loadItemsFromAPI).toHaveBeenCalledWith({
                page: 0,
                size: PAGE_SIZE
            });
        });

        it('should set page number to 0 if state params have changed', function() {
            paginationService.registerUrl({
                size: 20,
                page: stateParams.page,
                someParam: 'param'
            }, loadItemsFromAPI);
            $rootScope.$apply();

            expect(loadItemsFromAPI).toHaveBeenCalledWith({
                page: 0,
                size: 20,
                someParam: 'param'
            });
        });

        it('should set page size to 0 when method does not return promise', function() {
            paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            expect(paginationService.getSize()).toEqual(0);
        });

        it('should set page number to 0 when method does not return promise', function() {
            paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            expect(paginationService.getPage()).toEqual(0);
        });

        it('should set total items to 0 when method does not return promise', function() {
            paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            expect(paginationService.getTotalItems()).toEqual(0);
        });

        it('should set showing items to 0 when method does not return promise', function() {
            paginationService.registerUrl({}, jasmine.createSpy().andReturn(null));
            expect(paginationService.getShowingItems()).toEqual(0);
        });
    });

    describe('registerList', function() {

        var stateParams = {
                page: 1,
                size: 5,
                someParam: 'param'
            },
            items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            loadItemsFromAPI,
            validator = jasmine.createSpy(),
            promise;

        beforeEach(function() {
            loadItemsFromAPI = jasmine.createSpy().andReturn(items);
            promise = paginationService.registerList(validator, stateParams, loadItemsFromAPI);
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
            expect(paginationService.itemValidator).toEqual(validator);
        });

        it('should set page size and number to default one if they are undefined', function() {
            paginationService.registerUrl({}, loadItemsFromAPI);
            $rootScope.$apply();
            expect(loadItemsFromAPI).toHaveBeenCalledWith({
                page: 0,
                size: PAGE_SIZE
            });
        });

        it('should set page number to 0 if state params have changed', function() {
            paginationService.registerUrl({
                size: 20,
                page: stateParams.page,
                someParam: 'param'
            }, loadItemsFromAPI);
            $rootScope.$apply();

            expect(loadItemsFromAPI).toHaveBeenCalledWith({
                page: 0,
                size: 20,
                someParam: 'param'
            });
        });
    });
});
