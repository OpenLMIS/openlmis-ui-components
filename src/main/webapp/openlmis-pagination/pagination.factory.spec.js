describe('paginationFactory', function() {

    var paginationFactory, items;

    beforeEach(function() {
        module('openlmis-pagination');

        inject(function($injector) {
            paginationFactory = $injector.get('paginationFactory');
        });

        items = [
            'itemOne', 'itemTwo', 'itemThree', 'itemFour', 'itemFive', 'itemSix', 'itemSeven',
            'itemEight', 'itemNine', 'itemTen', 'itemEleven'
        ];
    });

    it('getPage should return full page', function() {
        expect(paginationFactory.getPage(items, 0, 3)).toEqual([
            items[0], items[1], items[2]
        ]);
    });

    it('getPage should return last page correctly', function() {
        expect(paginationFactory.getPage(items, 3, 3)).toEqual([
            items[9], items[10]
        ]);
    });

    it('getPage should return empty array if the page is out of range', function() {
        expect(paginationFactory.getPage(items, 5, 3)).toEqual([]);
    });

    it('getPage should fall back to the default page size if page size is not given', function() {
        expect(paginationFactory.getPage(items, 0)).toEqual([
            items[0], items[1], items[2], items[3], items[4], items[5], items[6], items[7],
            items[8], items[9]
        ]);
    });

});
