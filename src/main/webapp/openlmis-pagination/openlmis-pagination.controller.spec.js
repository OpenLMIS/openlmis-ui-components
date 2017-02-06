describe('PaginationController', function() {

    var vm, scope;

    beforeEach(function() {

        module('openlmis-pagination');

        inject(function($controller, $rootScope) {
            vm = $controller('PaginationController');

            vm.totalItems = 10;
            vm.pageSize = 2;
            vm.page = 0;
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
});
