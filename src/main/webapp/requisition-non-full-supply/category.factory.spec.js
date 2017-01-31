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
                productCategoryDisplayName: 'Category Two'
            }, {
                programId: '2',
                productCategoryDisplayName: 'Category Three'
            }]
        }, {
            programs: [{
                programId: '4',
                productCategoryDisplayName: 'Category Four'
            }, {
                programId: '1',
                productCategoryDisplayName: 'Category Two'
            }]
        }, {
            $visible: true,
            programs: [{
                programId: '1',
                productCategoryDisplayName: 'Category One'
            }, {
                programId: '3',
                productCategoryDisplayName: 'Category Three'
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
