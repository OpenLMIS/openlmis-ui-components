describe('paginatedListFactory', function() {

    var paginatedListFactory, items, pageSize, paginatedList, numberOfItems;

    beforeEach(function() {
        pageSize = 3;

        module('openlmis-pagination', function($provide) {
            $provide.constant('PAGINATION_CONSTANTS', {PAGE_SIZE: pageSize});
        });

        inject(function(_paginatedListFactory_) {
            paginatedListFactory = _paginatedListFactory_;
        });

        items = [1, 2, 3, 4, 5, 6, 7];
        numberOfItems = items.length;
        paginatedList = paginatedListFactory.getPaginatedItems(items);
    });

    describe('getPaginatedItems', function() {

        it('should return array', function() {
            expect(angular.isArray(paginatedList)).toBe(true);
        });

        it('should return array with proper amount of pages', function() {
            var numberOfPages = Math.ceil(numberOfItems / pageSize);
            expect(paginatedList.length).toEqual(numberOfPages);
        });

        it('each page should have at most pageSize elements', function() {
            var itemCount = 0;

            angular.forEach(paginatedList, function(page, index) {
                itemCount = itemCount + page.length;
                if(index === paginatedList.length - 1) expect(page.length < pageSize).toBe(true);
                else expect(page.length).toEqual(pageSize);
            });

            expect(itemCount).toEqual(numberOfItems);
        });

        it('should return getter', function() {
            expect(angular.isFunction(paginatedList.getPage)).toBe(true);
        });
    });

    describe('getPage', function() {

        it('should get proper page', function() {
            var pageNumber = 1;
            expect(paginatedList.getPage(pageNumber)).toEqual(paginatedList[pageNumber - 1]);
        });

        it('should return undefined if page number is out of range', function() {
            expect(paginatedList.getPage(0)).toEqual(undefined);
            expect(paginatedList.getPage(paginatedList.length + 1)).toEqual(undefined);
        });
    });

});
