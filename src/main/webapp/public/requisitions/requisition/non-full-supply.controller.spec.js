describe('NonFullSupplyCtrl', function() {

    var vm;

    var scope, requisitionValidator, RequisitionCategory;

    beforeEach(module('openlmis.requisitions'));

    beforeEach(function() {
        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
        RequisitionCategory = jasmine.createSpy('RequisitionCategory');

    });

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
        scope.$parent = $rootScope.$new();
        scope.$parent.requisition = requisitionSpy();
    }));

    beforeEach(inject(function($controller) {
        vm = $controller('NonFullSupplyCtrl', {
            $scope: scope,
            requisitionValidator: requisitionValidator,
            RequisitionCategory: RequisitionCategory
        });
    }));

    it('should delete line item', function() {
        vm.deleteLineItem(scope.$parent.requisition.requisitionLineItems[0]);
        expect(scope.$parent.requisition.requisitionLineItems.length).toBe(4);
        expect(scope.$parent.requisition.requisitionLineItems[0].category).not.toBe('One');
    });

    function requisitionSpy() {
        return {
            $template: templateSpy(),
            requisitionLineItems: [
                lineItemSpy(0, 'One', true),
                lineItemSpy(1, 'Two', true),
                lineItemSpy(2, 'One', true),
                lineItemSpy(3, 'Two', true),
                lineItemSpy(4, 'Three', false)
            ]
        };
    }

    function templateSpy() {
        return jasmine.createSpyObj('Template', ['getColumns']);
    }

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
