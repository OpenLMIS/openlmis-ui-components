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

        this.vm = this.$controller('PaginationController', {
            $scope: this.$rootScope.$new(),
            $stateParams: this.$stateParams
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should setup view value for external pagination', function() {
            expect(this.vm.page).toEqual(0);
            expect(this.vm.pageSize).toEqual(2);
            expect(this.vm.totalItems).toEqual(10);
            expect(this.vm.showingItems).toEqual(2);
        });

        it('should setup view value for local pagination', function() {
            this.paginationService.isExternalPagination.andReturn(false);
            this.vm.list = [1];
            this.vm.$onInit();

            expect(this.vm.page).toEqual(0);
            expect(this.vm.pageSize).toEqual(2);
            expect(this.vm.totalItems).toEqual(this.vm.list.length);
            expect(this.vm.pagedList).toEqual([1]);
            expect(this.vm.showingItems).toEqual(this.vm.pagedList.length);
        });
    });

    describe('watch paginated list', function() {

        it('should fire on init when list changes', function() {
            spyOn(this.vm, '$onInit');
            this.vm.list = [];
            this.$rootScope.$apply();

            expect(this.vm.$onInit).toHaveBeenCalled();
        });
    });

    describe('changePage', function() {

        beforeEach(function() {
            this.newPage = 4;
            this.vm.changePage(this.newPage);
        });

        it('should change current page', function() {
            expect(this.vm.page).toEqual(this.newPage);
            expect(this.$state.go).toHaveBeenCalledWith(this.$state.current.name, {
                customPageParamName: 4,
                size: 2
            }, {
                reload: true,
                notify: true
            });
        });

        it('should not change current page if number is out of range', function() {
            expect(this.vm.page).toEqual(this.newPage);

            this.vm.changePage(this.newPage + 1);

            expect(this.vm.page).toEqual(this.newPage);

            expect(this.$state.go.callCount).toEqual(1);
        });

        it('should change page for local pagination', function() {
            this.paginationService.isExternalPagination.andReturn(false);
            this.vm.list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            this.vm.$onInit();

            this.vm.changePage(this.newPage);

            expect(this.paginationFactory.getPage).toHaveBeenCalledWith(this.vm.list, this.newPage, this.vm.pageSize);
            expect(this.vm.page).toEqual(this.newPage);
            expect(this.$state.go).toHaveBeenCalledWith(this.$state.current.name, {
                customPageParamName: 4,
                size: 2
            }, {
                reload: false,
                notify: false
            });
        });
    });

    describe('nextPage', function() {
        it('should change page to the next one', function() {
            var lastPage = this.vm.page;

            this.vm.nextPage();

            expect(this.vm.page).toEqual(lastPage + 1);
        });
    });

    describe('previousPage', function() {
        it('should change page to the last one', function() {
            var lastPage = (this.vm.page = 1);

            this.vm.previousPage();

            expect(this.vm.page).toEqual(lastPage - 1);
        });
    });

    describe('isCurrentPage', function() {

        it('should check if page is current one', function() {
            expect(this.vm.isCurrentPage(this.vm.page)).toBe(true);
        });

        it('should call change page callback', function() {
            expect(this.vm.isCurrentPage(this.vm.page + 1)).toBe(false);
        });
    });

    describe('isFirstPage', function() {

        it('should check if page is first one', function() {
            this.vm.changePage(0);

            expect(this.vm.isFirstPage()).toBe(true);
        });

        it('should call change page callback', function() {
            this.vm.changePage(1);

            expect(this.vm.isFirstPage()).toBe(false);
        });
    });

    describe('isLastPage', function() {

        it('should return true if page is last', function() {
            this.vm.changePage(4);

            expect(this.vm.isLastPage()).toBe(true);
        });

        it('should return false if page is not last', function() {
            this.vm.changePage(3);

            expect(this.vm.isLastPage()).toBe(false);
        });
    });

    describe('getPages', function() {

        it('should return array', function() {
            expect(angular.isArray(this.vm.getPages())).toBe(true);
        });

        it('should return correct number of elements', function() {
            expect(this.vm.getPages().length).toBe(4);
        });

        it('should return correct number of elements if selected page is not first one', function() {
            this.vm.page = 3;

            expect(this.vm.getPages().length).toBe(5);
        });
    });

    describe('getTotalPages', function() {

        it('should return number', function() {
            expect(angular.isNumber(this.vm.getTotalPages())).toBe(true);
        });

        it('should return correct number of elements', function() {
            expect(this.vm.getTotalPages()).toBe(5);
        });
    });

    describe('isPageValid', function() {

        it('should return true if item validator is not defined', function() {
            this.paginationService.getItemValidator.andReturn(undefined);

            expect(this.vm.isPageValid(1)).toBe(true);
            expect(this.vm.isPageValid(0)).toBe(true);
            expect(this.vm.isPageValid(2)).toBe(true);
        });

        it('should return false if item validator returns false', function() {
            this.vm.totalItems = 1;
            this.vm.pageSize = 1;
            this.validatorSpy.andReturn(false);

            expect(this.vm.isPageValid(0)).toBe(false);
        });

        it('should return true if item validator returns true', function() {
            this.vm.totalItems = 1;
            this.vm.pageSize = 1;
            this.validatorSpy.andReturn(true);

            expect(this.vm.isPageValid(0)).toBe(true);
        });
    });
});