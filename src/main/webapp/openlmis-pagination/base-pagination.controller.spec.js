describe('BasePaginationController', function() {

    var vm, $controller, $state, paginationFactory, page, pageSize, items, totalItems,
        externalPagination, itemValidator, stateName, stateParams;

    beforeEach(function() {
        module('openlmis-pagination');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            paginationFactory = $injector.get('paginationFactory');
        });

        vm = {};

        page = 0;

        pageSize = 3;

        items = [
            'itemOne',
            'itemTwo',
            'itemThree',
            'itemFour',
            'itemFive'
        ];

        totalItems = 5;

        externalPagination = false;

        stateName = 'someState'

        stateParams = {
            page: page,
            size: pageSize
        };

        $state.current = {
            name: stateName
        };

        spyOn($state, 'go').andReturn();
    });

    describe('initialization', function() {

        it('should expose items', function() {
            initController();

            expect(vm.items).toEqual(items);
        });

        it('should expose stateParams', function() {
            initController();

            expect(vm.stateParams).toEqual({
                page: page,
                size: pageSize
            });
        });

        it('should expose totalItems', function() {
            initController();

            expect(vm.totalItems).toEqual(totalItems);
        });

        it('should expose items as pageItems if external pagination is used', function() {
            externalPagination = true;

            initController();

            expect(vm.pageItems).toEqual(items);
        });

        it('should expose pageItems if no external pagination is used', function() {
            initController();

            expect(vm.pageItems).toEqual([
                items[0],
                items[1],
                items[2]
            ]);
        });

    });

    describe('updateUrl', function() {

        it('should reload state if external pagination is used', function() {
            externalPagination = true;

            initController();
            vm.updateUrl();

            expect($state.go).toHaveBeenCalledWith(stateName, stateParams, {
                reload: true,
                notify: true
            });
        });

        it('should not reload state if no external pagination is used', function() {
            initController();
            vm.updateUrl();

            expect($state.go).toHaveBeenCalledWith(stateName, stateParams, {
                reload: false,
                notify: false
            });
        });

    });

    describe('changePage', function() {

        it('should update page items', function() {
            initController();
            vm.stateParams.page = 1;
            vm.changePage();

            expect(vm.pageItems).toEqual([
                items[3],
                items[4]
            ]);
        });

        it('should reload state if external pagination is used', function() {
            externalPagination = true;

            initController();
            vm.changePage();

            expect($state.go).toHaveBeenCalledWith(stateName, stateParams, {
                reload: true,
                notify: true
            });
        });

        it('should update url if no external pagination is used', function() {
            initController();
            vm.changePage();

            expect($state.go).toHaveBeenCalledWith(stateName, stateParams, {
                reload: false,
                notify: false
            });
        });

    });

    it('getPage should call pagination factory', function() {
        initController();
        spyOn(paginationFactory, 'getPage').andCallThrough();
        vm.getPage(1);

        expect(paginationFactory.getPage).toHaveBeenCalledWith(items, 1, pageSize);
    });

    describe('isPageValid', function() {

        beforeEach(function() {
            itemValidator = jasmine.createSpy('itemValidator');
        });

        it('should return true if item validator is not specified', function() {
            itemValidator = undefined;

            initController();

            expect(vm.isPageValid(3223)).toEqual(true);
        });

        it('should return true if all items are valid', function() {
            itemValidator.andReturn(true);

            initController();

            expect(vm.isPageValid(0)).toEqual(true);
        });

        it('should return false if any of the line items is invalid', function() {
            itemValidator.andCallFake(function(item) {
                return item !== items[1];
            });

            initController();

            expect(vm.isPageValid(0)).toEqual(false);
        });

    });

    function initController() {
        $controller('BasePaginationController', {
            vm: vm,
            page: page,
            pageSize: pageSize,
            items: items,
            totalItems: totalItems,
            externalPagination: externalPagination,
            itemValidator: itemValidator
        });
    }

});
