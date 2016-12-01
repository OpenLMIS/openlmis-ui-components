describe('NonFullSupplyCtrl', function() {

    var vm, scope, requisitionValidator, RequisitionCategory, requisition;

    beforeEach(module('openlmis.requisitions'));

    beforeEach(function() {
        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
        RequisitionCategory = jasmine.createSpy('RequisitionCategory');
    });

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
        scope.$parent = $rootScope.$new();
        scope.$parent.requisition = {
            $template: jasmine.createSpyObj('Template', ['getColumns']),
            requisitionLineItems: [
                lineItemSpy(0, 'One', true),
                lineItemSpy(1, 'Two', true),
                lineItemSpy(2, 'One', true),
                lineItemSpy(3, 'Two', true),
                lineItemSpy(4, 'Three', false)
            ]
        };
        requisition = scope.$parent.requisition;
    }));

    beforeEach(inject(function($controller) {
        vm = $controller('NonFullSupplyCtrl', {
            $scope: scope,
            requisitionValidator: requisitionValidator,
            RequisitionCategory: RequisitionCategory
        });
    }));

    it('should delete line item', function() {
        vm.deleteLineItem(requisition.requisitionLineItems[0]);
        expect(requisition.requisitionLineItems.length).toBe(4);
        expect(requisition.requisitionLineItems[0].category).not.toBe('One');
    });

    it('should bind requisitionValidator.isLineItemValid method to vm', function() {
        expect(vm.isLineItemValid).toBe(requisitionValidator.isLineItemValid);
    });

    it('should bind requisition property to vm', function() {
        expect(vm.requisition).toBe(requisition);
    });

    it('should bind columns property to vm', function() {
        expect(vm.columns).toBe(requisition.$template.getColumns());
    });

    it('should bind requisitionLineItems property to vm', function() {
        expect(vm.lineItems).toBe(requisition.requisitionLineItems);
    });

    function lineItemSpy(id, category, fullSupply) {
        return {
            $id: id,
            $program: {
                productCategoryDisplayName: category,
                fullSupply: fullSupply
            },
            orderableProduct: {
                $visible: false
            }
        };
    }

});
