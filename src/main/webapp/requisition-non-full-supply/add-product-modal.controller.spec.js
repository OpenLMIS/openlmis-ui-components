describe('AddProductModalController', function() {

    var vm, programId, categories, deferredMock, $ngBootbox, $controller;

    beforeEach(function() {
        module('requisition-non-full-supply');

        inject(function($injector) {
            $ngBootbox = $injector.get('$ngBootbox');
            $controller = $injector.get('$controller');
        });

        programId = 'some-program-id';

        deferredMock = jasmine.createSpyObj('deferred', ['reject', 'resolve']);

        categories = [{
            name: 'Category One'
        }, {
            name: 'Category Two'
        }];
    });

    it('initialization should expose categories', function() {
        vm = $controller('AddProductModalController', {
            categories: categories,
            deferred: deferredMock,
            programId: programId
        });

        expect(vm.categories).toEqual(categories);
    });

    describe('categoryVisible', function() {

        var category;

        beforeEach(function() {
            category = {
                name: 'Category One',
                products: [{
                    $visible: true
                }, {
                    $visible: false
                }]
            };

            vm = $controller('AddProductModalController', {
                categories: categories,
                deferred: deferredMock,
                programId: programId
            });
        });

        it('should return true if at least one product is visible', function() {
            expect(vm.categoryVisible(category)).toEqual(true);
        });

        it('should return false if all the products are invisible', function() {
            category.products[0].$visible = false;

            expect(vm.categoryVisible(category)).toEqual(false);
        });

    });

    describe('productVisible', function() {

        var product;

        beforeEach(function() {
            product = {};

            vm = $controller('AddProductModalController', {
                categories: categories,
                deferred: deferredMock,
                programId: programId
            });
        });

        it('should return true if product is visible', function() {
            product.$visible = true;

            expect(vm.productVisible(product)).toEqual(true);
        });

        it('should return false if product is not visible', function() {
            product.$visible = false;

            expect(vm.productVisible(product)).toEqual(false);
        });

    });

    describe('addProduct', function() {

        beforeEach(function() {
            spyOn($ngBootbox, 'hideAll');

            vm = $controller('AddProductModalController', {
                categories: categories,
                deferred: deferredMock,
                programId: programId
            });

            vm.requestedQuantity = 100;
            vm.requestedQuantityExplanation = 'some explanation';
            vm.selectedProduct = {
                programs: [{
                    programId: 'some-program-id',
                    pricePerPack: 10
                }, {
                    programId: 'some-other-program',
                    pricePerPack: 20
                }]
            };
        });

        it('should close modal', function() {
            vm.addProduct();

            expect($ngBootbox.hideAll).toHaveBeenCalled();
        });

        it('should resolve to new line item', function() {
            vm.addProduct();

            expect(deferredMock.resolve).toHaveBeenCalledWith({
                requestedQuantity: 100,
                requestedQuantityExplanation: 'some explanation',
                pricePerPack: 10,
                orderable: vm.selectedProduct,
                $deletable: true
            });
        });

        it('should mark the product as not visible', function() {
            vm.addProduct();

            expect(vm.selectedProduct.$visible).toEqual(false);
        });

    });

    describe('close', function() {

        beforeEach(function() {
            spyOn($ngBootbox, 'hideAll');

            vm = $controller('AddProductModalController', {
                categories: categories,
                deferred: deferredMock,
                programId: programId
            });
        });

        it('should close modal', function() {
            vm.close();

            expect($ngBootbox.hideAll).toHaveBeenCalled();
        });

        it('should reject deferred', function() {
            vm.close();

            expect(deferredMock.reject).toHaveBeenCalled();
        });

    });

});
