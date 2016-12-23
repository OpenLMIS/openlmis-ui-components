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
            $template: jasmine.createSpyObj('Template', ['getColumns']),
            requisitionLineItems: [
                lineItem('One', true),
                lineItem('Two', true),
                lineItem('One', true),
                lineItem('Two', true),
                lineItem('Three', false)
            ]
        }

        function lineItem(category, fullSupply) {
            return {
                $program: {
                    productCategoryDisplayName: category,
                    fullSupply: fullSupply
                }
            };
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



});
