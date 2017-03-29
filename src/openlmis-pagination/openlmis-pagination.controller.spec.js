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

describe('PaginationController', function() {

    var vm, scope, $controller, $state, paginationService;

    beforeEach(function() {

        module('openlmis-pagination');

        inject(function($injector) {
            $state = $injector.get('$state');
            $controller = $injector.get('$controller');
            paginationService = $injector.get('paginationService');
            paginationFactory = $injector.get('paginationFactory');

            spyOn(paginationService, 'isExternalPagination').andReturn(true);
            spyOn(paginationFactory, 'getPage').andReturn([1]);

            vm = $controller('PaginationController');

            vm.totalItems = 10;
            vm.pageSize = 2;
            vm.page = 0;

            spyOn($state, 'go').andReturn();
        });
    });

    describe('changePage', function() {

        var newPage = 4;

        beforeEach(function() {
            vm.changePage(newPage);
        });

        it('should change current page', function() {
            expect(vm.page).toEqual(newPage);
        });

        it('should not change current page if number is out of range', function() {
            expect(vm.page).toEqual(newPage);

            vm.changePage(newPage + 1);
            expect(vm.page).toEqual(newPage);
        });
    });

    describe('nextPage', function() {
        it('should change page to the next one', function() {
            var lastPage = vm.page;

            vm.nextPage();
            expect(vm.page).toEqual(lastPage + 1);
        });
    });

    describe('previousPage', function() {
        it('should change page to the last one', function() {
            var lastPage = (vm.page = 1);

            vm.previousPage();

            expect(vm.page).toEqual(lastPage - 1);
        });
    });

    describe('isCurrentPage', function() {

        it('should check if page is current one', function() {
            expect(vm.isCurrentPage(vm.page)).toBe(true);
        });

        it('should call change page callback', function() {
            expect(vm.isCurrentPage(vm.page + 1)).toBe(false);
        });
    });

    describe('isFirstPage', function() {

        it('should check if page is first one', function() {
            vm.changePage(0);
            expect(vm.isFirstPage()).toBe(true);
        });

        it('should call change page callback', function() {
            vm.changePage(1);
            expect(vm.isFirstPage()).toBe(false);
        });
    });

    describe('isLastPage', function() {

        it('should return true if page is last', function() {
            vm.changePage(4);
            expect(vm.isLastPage()).toBe(true);
        });

        it('should return false if page is not last', function() {
            vm.changePage(3);
            expect(vm.isLastPage()).toBe(false);
        });
    });

    describe('getPages', function() {

        it('should return array', function() {
            expect(angular.isArray(vm.getPages())).toBe(true);
        });

        it('should return correct number of elements', function() {
            expect(vm.getPages().length).toBe(5);
        });
    });

    describe('getTotalPages', function() {

        it('should return array', function() {
            expect(angular.isNumber(vm.getTotalPages())).toBe(true);
        });

        it('should return correct number of elements', function() {
            expect(vm.getTotalPages()).toBe(5);
        });

        it('should equals getPages length', function() {
            expect(vm.getTotalPages()).toBe(vm.getPages().length);
        });
    });

    describe('isPageValid', function() {

        it('should return true if item validator is not defined', function() {
            expect(vm.isPageValid(1)).toBe(true);
            expect(vm.isPageValid(0)).toBe(true);
            expect(vm.isPageValid(2)).toBe(true);
        });

        it('should return false if item validator returns false', function() {
            vm.totalItems = 1;
            vm.pageSize = 1;
            paginationService.itemValidator = function() {
                return false;
            };

            expect(vm.isPageValid(0)).toBe(false);
        });

        it('should return false if item validator returns true', function() {
            vm.totalItems = 1;
            vm.pageSize = 1;
            paginationService.itemValidator = function() {
                return true;
            };

            expect(vm.isPageValid(0)).toBe(true);
        });
    });
});
