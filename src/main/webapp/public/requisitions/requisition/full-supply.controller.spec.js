describe('FullSupplyCtrl', function() {

    //tested
    var vm;

    //mocks
    var scope, requisitionValidator;

    beforeEach(module('openlmis.requisitions'));

    beforeEach(function() {
        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
    });

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
        scope.$parent = $rootScope.$new();
        scope.$parent.requisition = requisitionSpy();
    }));

    beforeEach(inject(function($controller) {
        vm = $controller('FullSupplyCtrl', {
            $scope: scope,
            requisitionValidator: requisitionValidator
        });
    }));

    it('should group line items by category', function() {
        expect(vm.categories['One'].length).toBe(2);
        expect(vm.categories['One'][0]).toBe(scope.$parent.requisition.requisitionLineItems[0]);
        expect(vm.categories['One'][1]).toBe(scope.$parent.requisition.requisitionLineItems[2]);

        expect(vm.categories['Two'].length).toBe(2);
        expect(vm.categories['Two'][0]).toBe(scope.$parent.requisition.requisitionLineItems[1]);
        expect(vm.categories['Two'][1]).toBe(scope.$parent.requisition.requisitionLineItems[3]);
    });

    it('should expose requisitionValidator.isLineItemValid method', function() {
        expect(vm.isLineItemValid).toBe(requisitionValidator.isLineItemValid);
    });

    function requisitionSpy() {
        return {
            $template: templateSpy(),
            requisitionLineItems: [
                lineItemSpy(0, 'One'),
                lineItemSpy(1, 'Two'),
                lineItemSpy(2, 'One'),
                lineItemSpy(3, 'Two')
            ]
        };
    }

    function templateSpy() {
        return jasmine.createSpyObj('Template', ['getColumns']);
    }

    function lineItemSpy(id, category) {
        return {
            $id: id,
            $program: {
                productCategoryDisplayName: category
            }
        };
    }

});
