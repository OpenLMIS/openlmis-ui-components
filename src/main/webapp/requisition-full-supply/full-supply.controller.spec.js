describe('FullSupplyCtrl', function() {

    //tested
    var vm;

    //mocks
    var requisition, requisitionValidator;

    beforeEach(module('requisition-full-supply'));

    beforeEach(function() {
        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
    });

    beforeEach(function($rootScope) {
        requisition = {
            $template: jasmine.createSpyObj('RequisitionTemplate', ['getColumns']),
            requisitionLineItems: [
                lineItem('One', true),
                lineItem('Two', true),
                lineItem('One', true),
                lineItem('Two', true),
                lineItem('Three', false)
            ]
        };

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
        vm = $controller('FullSupplyCtrl', {
            requisition: requisition,
            requisitionValidator: requisitionValidator
        });
    }));

    it('should group line items by category', function() {
        expect(vm.categories['One'].length).toBe(2);
        expect(vm.categories['One'][0]).toBe(requisition.requisitionLineItems[0]);
        expect(vm.categories['One'][1]).toBe(requisition.requisitionLineItems[2]);

        expect(vm.categories['Two'].length).toBe(2);
        expect(vm.categories['Two'][0]).toBe(requisition.requisitionLineItems[1]);
        expect(vm.categories['Two'][1]).toBe(requisition.requisitionLineItems[3]);
    });

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
