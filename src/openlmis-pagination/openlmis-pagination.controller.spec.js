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

ddescribe('PaginationController', function() {

    var vm, stateParams, $controller, $rootScope, $state, paginationService, paginationFactory, paginationElementMock,
        containerMock, tableMock, openlmisTableFormControllerMock;

    beforeEach(function() {

        module('openlmis-pagination');

        inject(function($injector) {
            $state = $injector.get('$state');
            $controller = $injector.get('$controller');
            paginationService = $injector.get('paginationService');
            paginationFactory = $injector.get('paginationFactory');
            $rootScope = $injector.get('$rootScope');
        });

        stateParams = {
            page: 0,
            size: 2
        };

        paginationElementMock = jasmine.createSpyObj('paginationElement', ['parents']);
        containerMock = jasmine.createSpyObj('containerElement', ['find']);
        tableMock = jasmine.createSpyObj('tableElement', ['controller']);
        openlmisTableFormControllerMock = jasmine.createSpyObj('openlmisTableFormController', ['showsErrors']);


        spyOn(paginationService, 'isExternalPagination').andReturn(true);
        spyOn(paginationService, 'getPage').andReturn(0);
        spyOn(paginationService, 'getSize').andReturn(2);
        spyOn(paginationService, 'getTotalItems').andReturn(10);
        spyOn(paginationService, 'getShowingItems').andReturn(2);

        spyOn(paginationFactory, 'getPage').andReturn([1]);

        paginationElementMock.parents.andReturn(containerMock);
        containerMock.find.andReturn(tableMock);
        tableMock.controller.andReturn(openlmisTableFormControllerMock);
        openlmisTableFormControllerMock.showsErrors.andReturn(false);

        spyOn($state, 'go').andReturn();

        vm = $controller('PaginationController', {
            $scope: $rootScope.$new(),
            $stateParams: stateParams,
            $element: paginationElementMock
        });
        vm.$onInit();
    });

    describe('onInit', function() {

        it('should setup view value for external pagination', function() {
            expect(vm.page).toEqual(0);
            expect(vm.pageSize).toEqual(2);
            expect(vm.totalItems).toEqual(10);
            expect(vm.showingItems).toEqual(2);
        });

        it('should setup view value for local pagination', function() {
            paginationService.isExternalPagination.andReturn(false);
            vm.list = [1];
            vm.$onInit();

            expect(vm.page).toEqual(0);
            expect(vm.pageSize).toEqual(2);
            expect(vm.totalItems).toEqual(vm.list.length);
            expect(vm.pagedList).toEqual([1]);
            expect(vm.showingItems).toEqual(vm.pagedList.length);
        });
    });

    describe('watch paginated list', function() {

        it('should fire on init when list changes', function() {
            spyOn(vm, '$onInit');
            vm.list = [];
            $rootScope.$apply();
            expect(vm.$onInit).toHaveBeenCalled();
        });
    });

    describe('changePage', function() {

        var newPage = 4;

        beforeEach(function() {
            vm.changePage(newPage);
        });

        it('should change current page', function() {
            expect(vm.page).toEqual(newPage);
            expect($state.go).toHaveBeenCalledWith($state.current.name, {
                page: 4,
                size: 2
            }, {
                reload: $state.current.name,
                notify: true
            });
        });

        it('should not change current page if number is out of range', function() {
            expect(vm.page).toEqual(newPage);

            vm.changePage(newPage + 1);
            expect(vm.page).toEqual(newPage);

            expect($state.go.callCount).toEqual(1);
        });

        it('should change page for local pagination', function() {
            paginationService.isExternalPagination.andReturn(false);
            vm.list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            vm.$onInit();

            vm.changePage(newPage);

            expect(paginationFactory.getPage).toHaveBeenCalledWith(vm.list, newPage, vm.pageSize);
            expect(vm.page).toEqual(newPage);
            expect($state.go).toHaveBeenCalledWith($state.current.name, {
                page: 4,
                size: 2
            }, {
                reload: $state.current.name,
                notify: false
            });
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
            expect(vm.getPages().length).toBe(4);
        });

        it('should return correct number of elements if selected page is not first one', function() {
            vm.page = 3;
            expect(vm.getPages().length).toBe(5);
        });
    });

    describe('getTotalPages', function() {

        it('should return number', function() {
            expect(angular.isNumber(vm.getTotalPages())).toBe(true);
        });

        it('should return correct number of elements', function() {
            expect(vm.getTotalPages()).toBe(5);
        });
    });

    describe('isPageValid', function() {

        it('should return true if item validator is not defined', function() {
            expect(vm.isPageValid(1)).toBe(true);
            expect(vm.isPageValid(0)).toBe(true);
            expect(vm.isPageValid(2)).toBe(true);
        });

        iit('should return false if item validator returns false', function() {
            vm.totalItems = 1;
            vm.pageSize = 1;
            vm.page = 1;
            paginationService.itemValidator = function() {
                return false;
            };

            expect(vm.isPageValid(0)).toBe(false);
        });

        it('should return false if item validator returns true', function() {
            vm.totalItems = 1;
            vm.pageSize = 1;
            vm.page = 1;
            paginationService.itemValidator = function() {
                return true;
            };

            expect(vm.isPageValid(0)).toBe(true);
        });
    });
});
