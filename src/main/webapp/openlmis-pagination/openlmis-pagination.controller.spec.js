describe('PaginationController', function() {

    var vm, scope;

    beforeEach(function() {

        module('openlmis-pagination');

        inject(function($controller, $rootScope) {

            scope = $rootScope.$new();

            scope.items = [
                [1, 2],
                [3, 4]
            ];
            scope.currentPage = 1;
            scope.items.getPage = jasmine.createSpy();
            scope.isItemValid = jasmine.createSpy();
            scope.changePage = jasmine.createSpy();

            scope.items.getPage.andReturn(scope.items[0]);

            vm = $controller('PaginationController', {
                $scope: scope
            });
        });
    });

    describe('changePage', function() {

        var newPage = 2;

        beforeEach(function() {
            vm.changePage(newPage);
        });

        it('should change current page', function() {
            expect(scope.currentPage).toEqual(newPage);
        });

        it('should call change page callback', function() {
            expect(scope.changePage).toHaveBeenCalledWith(newPage);
        });

        it('should not call change page callback when it is undefined', function() {
            scope.changePage = undefined;
            vm.changePage(newPage);
        });

        it('should not change current page if number is out of range', function() {
            expect(scope.currentPage).toEqual(newPage);

            vm.changePage(scope.items.length + 1);
            expect(scope.currentPage).toEqual(newPage);
        });
    });

    it('should change page to the next one', function() {
        var currentPage = scope.currentPage;

        vm.nextPage();
        expect(scope.currentPage).toEqual(currentPage + 1);
    });

    it('should change page to the last one', function() {
        var lastPage = scope.items.length;
        vm.changePage(lastPage);

        vm.previousPage();
        expect(scope.currentPage).toEqual(lastPage - 1);
    });

    describe('isCurrentPage', function() {

        it('should check if page is current one', function() {
            expect(vm.isCurrentPage(scope.currentPage)).toBe(true);
        });

        it('should call change page callback', function() {
            expect(vm.isCurrentPage(scope.currentPage + 1)).toBe(false);
        });
    });

    describe('isFirstPage', function() {

        it('should check if page is first one', function() {
            vm.changePage(1);
            expect(vm.isFirstPage()).toBe(true);
        });

        it('should call change page callback', function() {
            vm.changePage(2);
            expect(vm.isFirstPage()).toBe(false);
        });
    });

    describe('isLastPage', function() {

        it('should check if page is last one', function() {
            vm.changePage(scope.items.length);
            expect(vm.isLastPage()).toBe(true);
        });

        it('should call change page callback', function() {
            vm.changePage(scope.items.length - 1);
            expect(vm.isLastPage()).toBe(false);
        });
    });

    describe('getPageNumbers', function() {

        var array;

        beforeEach(function() {
            array = vm.getPageNumbers();
        });

        it('should return array', function() {
            expect(angular.isArray(array)).toBe(true);
        });

        it('should return correct number of elements', function() {
            expect(array.length).toBe(scope.items.length);
        });

        it('should return correct elements', function() {
            var i = 1;

            angular.forEach(array, function(element) {
                expect(element).toEqual(i);
                i++;
            });
        });
    });

    describe('isPageValid', function() {

        var page = 1;

        it('should call isItemValid callback', function() {
            vm.isPageValid(page);
            expect(scope.isItemValid).toHaveBeenCalled();
        });

        it('should not call isItemValid callback when it is not present and return true', function() {
            scope.isItemValid = undefined;
            expect(vm.isPageValid(page)).toBe(true);
        });
    });
});
