describe('categoryFactory', function() {

    var categoryFactory, products;

    beforeEach(function() {
        module('requisition-non-full-supply');

        inject(function($injector) {
            categoryFactory = $injector.get('categoryFactory');
        });

        products = [{
            $visible: true,
            programs: [{
                programId: '1',
                orderableCategoryDisplayName: 'Category Two'
            }, {
                programId: '2',
                orderableCategoryDisplayName: 'Category Three'
            }]
        }, {
            programs: [{
                programId: '4',
                orderableCategoryDisplayName: 'Category Four'
            }, {
                programId: '1',
                orderableCategoryDisplayName: 'Category Two'
            }]
        }, {
            $visible: true,
            programs: [{
                programId: '1',
                orderableCategoryDisplayName: 'Category One'
            }, {
                programId: '3',
                orderableCategoryDisplayName: 'Category Three'
            }]
        }];
    });

    it('should group products by categories', function() {
        expect(categoryFactory.groupProducts(products, '1')).toEqual([{
            name: 'Category Two',
            products: [
                products[0],
                products[1]
            ]
        }, {
            name: 'Category One',
            products: [
                products[2]
            ]
        }]);
    });

    it('should make product visible if the visibility is not set', function() {
        var result = categoryFactory.groupProducts(products, '1');

        expect(result[0].products[1].$visible).toEqual(true);
    });

});
