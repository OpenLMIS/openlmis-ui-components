describe('Category', function() {

    var Category;

    var name = 'TestCategory',
        lineItems;

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(_Category_) {
        Category = _Category_;
    }));

    beforeEach(function() {
        lineItems = [
            {
                beginningBalance: 10
            }, {
                beginningBalance: 20
            }
        ]
    });

    it('should create Column object', function() {
        var category = new Category(name, lineItems);

        expect(category.name).toBe(name);
        expect(category.lineItems).toBe(lineItems);
    });

    describe('isVisible', function() {

        it('should return true if at least one line item is visible', function() {
            lineItems[0].$visible = true;
            lineItems[1].$visible = false;

            var category = new Category(name, lineItems);

            expect(category.isVisible()).toBe(true);
        });

        it('should return false if all line items are invisible', function() {
            lineItems[0].$visible = false;
            lineItems[1].$visible = false;

            var category = new Category(name, lineItems);

            expect(category.isVisible()).toBe(false);
        });

    });

});
