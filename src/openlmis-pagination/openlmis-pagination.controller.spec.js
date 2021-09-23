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

    beforeEach(function() {
        module('openlmis-pagination');

        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.$controller = $injector.get('$controller');
            this.paginationService = $injector.get('paginationService');
            this.paginationFactory = $injector.get('paginationFactory');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
        });

        this.$stateParams = {
            customPageParamName: 0,
            size: 2
        };

        this.validatorSpy = jasmine.createSpy();

        spyOn(this.paginationService, 'isExternalPagination').andReturn(true);
        spyOn(this.paginationService, 'getPage').andReturn(0);
        spyOn(this.paginationService, 'getSize').andReturn(2);
        spyOn(this.paginationService, 'getTotalItems').andReturn(10);
        spyOn(this.paginationService, 'getShowingItems').andReturn(2);
        spyOn(this.paginationService, 'getPageParamName').andReturn('customPageParamName');
        spyOn(this.paginationService, 'getItemValidator').andReturn(this.validatorSpy);

        spyOn(this.paginationFactory, 'getPage').andReturn([1]);

        spyOn(this.$state, 'go').andReturn();

        this.initController = function() {
            this.pagination = this.$controller('PaginationController', {
                $scope: this.$rootScope.$new(),
                $stateParams: this.$stateParams
            });
            this.pagination.$onInit();
        };

        this.initController();
    });

    describe('onInit', function() {

        it('should setup view value for external pagination', function() {
            expect(this.pagination.page).toEqual(0);
            expect(this.pagination.pageSize).toEqual(2);
            expect(this.pagination.totalItems).toEqual(10);
            expect(this.pagination.showingItems).toEqual(2);
        });

        it('should setup view value for local pagination', function() {
            this.paginationService.isExternalPagination.andReturn(false);
            this.pagination.list = [1];
            this.pagination.$onInit();

            expect(this.pagination.page).toEqual(0);
            expect(this.pagination.pageSize).toEqual(2);
            expect(this.pagination.totalItems).toEqual(this.pagination.list.length);
            expect(this.pagination.pagedList).toEqual([1]);
            expect(this.pagination.showingItems).toEqual(this.pagination.pagedList.length);
        });
    });

    describe('watch paginated list', function() {

        it('should fire on init when list changes', function() {
            spyOn(this.pagination, '$onInit');
            this.pagination.list = [];
            this.$rootScope.$apply();

            expect(this.pagination.$onInit).toHaveBeenCalled();
        });
    });

    describe('changePage', function() {

        beforeEach(function() {
            this.$stateParams.customPageParamName = 4;
            this.initController();
        });

        it('should change current page', function() {
            this.newPage = 1;

            this.pagination.changePage(this.newPage);

            expect(this.$state.go).toHaveBeenCalledWith(this.$state.current.name, {
                customPageParamName: this.newPage,
                size: 2
            });
        });

        it('should call given function and then change page', function() {
            var deferred = this.$q.defer();

            this.newPage = 1;
            this.pagination.onPageChange = function() {
                deferred.resolve();
            };

            spyOn(this.pagination, 'onPageChange').andReturn(deferred.promise);

            this.pagination.changePage(this.newPage);

            expect(this.pagination.onPageChange).toHaveBeenCalled();
        });

        it('should change page for local pagination', function() {
            this.paginationService.isExternalPagination.andReturn(false);
            this.pagination.list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            this.pagination.$onInit();

            this.newPage = 1;
            this.pagination.changePage(this.newPage);

            expect(this.$state.go).toHaveBeenCalledWith(this.$state.current.name, {
                customPageParamName: this.newPage,
                size: 2
            });
        });

        it('should not change current page if number is out of range', function() {
            this.pagination.changePage(this.pagination.getTotalPages());

            expect(this.$state.go).not.toHaveBeenCalled();
        });
    });

    describe('nextPage', function() {
        it('should change page to the next one', function() {
            var lastPage = this.pagination.page;

            this.pagination.nextPage();

            expect(this.$state.go).toHaveBeenCalledWith(this.$state.current.name, {
                customPageParamName: lastPage + 1,
                size: 2
            });
        });
    });

    describe('previousPage', function() {
        it('should change page to the last one', function() {
            var lastPage = (this.pagination.page = 1);

            this.pagination.previousPage();

            expect(this.$state.go).toHaveBeenCalledWith(this.$state.current.name, {
                customPageParamName: lastPage - 1,
                size: 2
            });
        });
    });

    describe('isCurrentPage', function() {

        it('should check if page is current one', function() {
            expect(this.pagination.isCurrentPage(this.pagination.page)).toBe(true);
        });

        it('should call change page callback', function() {
            expect(this.pagination.isCurrentPage(this.pagination.page + 1)).toBe(false);
        });
    });

    describe('isFirstPage', function() {

        it('should return true if page is first', function() {
            this.pagination.page = 0;

            expect(this.pagination.isFirstPage()).toBe(true);
        });

        it('should return false if page is not first', function() {
            this.pagination.page = 1;

            expect(this.pagination.isFirstPage()).toBe(false);
        });
    });

    describe('isLastPage', function() {

        it('should return true if page is last', function() {
            this.pagination.page = 4;

            expect(this.pagination.isLastPage()).toBe(true);
        });

        it('should return false if page is not last', function() {
            this.pagination.changePage(3);

            expect(this.pagination.isLastPage()).toBe(false);
        });
    });

    describe('getPages', function() {

        it('should return array', function() {
            expect(angular.isArray(this.pagination.getPages())).toBe(true);
        });

        it('should return correct number of elements', function() {
            expect(this.pagination.getPages().length).toBe(4);
        });

        it('should return correct number of elements if selected page is not first one', function() {
            this.pagination.page = 3;

            expect(this.pagination.getPages().length).toBe(5);
        });
    });

    describe('getTotalPages', function() {

        it('should return number', function() {
            expect(angular.isNumber(this.pagination.getTotalPages())).toBe(true);
        });

        it('should return correct number of elements', function() {
            expect(this.pagination.getTotalPages()).toBe(5);
        });
    });

    describe('isPageValid', function() {

        it('should return true if item validator is not defined', function() {
            this.paginationService.getItemValidator.andReturn(undefined);

            expect(this.pagination.isPageValid(1)).toBe(true);
            expect(this.pagination.isPageValid(0)).toBe(true);
            expect(this.pagination.isPageValid(2)).toBe(true);
        });

        it('should return false if item validator returns false', function() {
            this.pagination.totalItems = 1;
            this.pagination.pageSize = 1;
            this.validatorSpy.andReturn(false);

            expect(this.pagination.isPageValid(0)).toBe(false);
        });

        it('should return true if item validator returns true', function() {
            this.pagination.totalItems = 1;
            this.pagination.pageSize = 1;
            this.validatorSpy.andReturn(true);

            expect(this.pagination.isPageValid(0)).toBe(true);
        });
    });
});