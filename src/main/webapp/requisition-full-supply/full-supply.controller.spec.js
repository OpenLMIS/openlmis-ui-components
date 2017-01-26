describe('FullSupplyController', function() {

    //tested
    var vm;

    //mocks
    var requisition, requisitionValidator, lineItems;

    beforeEach(module('requisition-full-supply'));

    beforeEach(function() {
        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
    });

    beforeEach(function($rootScope) {
        requisition = {
            template: jasmine.createSpyObj('RequisitionTemplate', ['getColumns']),
            requisitionLineItems: [
                lineItem('One', true),
                lineItem('Two', true),
                lineItem('One', true),
                lineItem('Two', true),
                lineItem('Three', false)
            ]
        };
        lineItems = [requisition.requisitionLineItems];

        function lineItem(category, fullSupply) {
            var lineItem = jasmine.createSpyObj('lineItem', ['canBeSkipped']);
            lineItem.canBeSkipped.andCallFake(function() {
                return lineItem.$program.productCategoryDisplayName === 'One';
            });
            lineItem.skipped = false;
            lineItem.$program =  {
                productCategoryDisplayName: category,
                fullSupply: fullSupply
            };
            return lineItem;
        }
    });

    beforeEach(inject(function($controller) {
        vm = $controller('FullSupplyController', {
            requisition: requisition,
            requisitionValidator: requisitionValidator,
            lineItems: lineItems,
            columns: []
        });
    }));

    it('should expose requisitionValidator.isLineItemValid method', function() {
        expect(vm.isLineItemValid).toBe(requisitionValidator.isLineItemValid);
    });

    it('should mark all full supply line items as skipped', function() {
        vm.skipAll();

        expect(requisition.requisitionLineItems[0].skipped).toBe(true);
        expect(requisition.requisitionLineItems[2].skipped).toBe(true);

        expect(requisition.requisitionLineItems[1].skipped).toBe(false);
        expect(requisition.requisitionLineItems[3].skipped).toBe(false);
        expect(requisition.requisitionLineItems[4].skipped).toBe(false);
    });

    it('should mark all full supply line items as not skipped', function() {
        vm.unskipAll();

        expect(requisition.requisitionLineItems[0].skipped).toBe(false);
        expect(requisition.requisitionLineItems[1].skipped).toBe(false);
        expect(requisition.requisitionLineItems[2].skipped).toBe(false);
        expect(requisition.requisitionLineItems[3].skipped).toBe(false);
        expect(requisition.requisitionLineItems[4].skipped).toBe(false);
    });
});
