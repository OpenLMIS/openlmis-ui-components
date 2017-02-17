describe('FullSupplyController', function() {

    //tested
    var vm;

    //mocks
    var requisition, requisitionValidator, lineItems, paginatedListFactory, columns, requisitionStatus;

    beforeEach(module('requisition-full-supply'));

    beforeEach(function() {
        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);

        paginatedListFactory = jasmine.createSpyObj('paginatedListFactory', ['getPaginatedItems']);
        paginatedListFactory.getPaginatedItems.andCallFake(function(lineItems) {
            return [lineItems];
        });
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

        lineItems = [
            requisition.requisitionLineItems[0],
            requisition.requisitionLineItems[1],
            requisition.requisitionLineItems[2],
            requisition.requisitionLineItems[3],
        ];

        requisitionStatus = "INITIALIZED";

        requisition.$isSubmitted = function(){
            if(requisitionStatus == "SUBMITTED"){
                return true;
            }
            return false;
        }
        requisition.$isInitiated = function(){
            if(requisitionStatus == "INITIALIZED"){
                return true;
            }
            return false;
        }

        columns = [{
            name: 'skipped'
        }];

        function lineItem(category, fullSupply) {
            var lineItem = jasmine.createSpyObj('lineItem', ['canBeSkipped']);
            lineItem.canBeSkipped.andCallFake(function() {
                return lineItem.$program.orderableCategoryDisplayName === 'One';
            });
            lineItem.skipped = false;
            lineItem.$program =  {
                orderableCategoryDisplayName: category,
                fullSupply: fullSupply
            };
            return lineItem;
        }
    });

    beforeEach(inject(function($controller) {
        vm = $controller('FullSupplyController', {
            requisition: requisition,
            requisitionValidator: requisitionValidator,
            items: lineItems,
            paginatedListFactory: paginatedListFactory,
            columns: columns,
            page: 0,
            pageSize: 10,
            totalItems: 4
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

    it('should only show skip controls if the requistions status is INITIALIZED or SUBMITTED', function(){
        // requisition status is INITIALIZED
        expect(vm.areSkipControlsVisible()).toBe(true);

        requisitionStatus = "SUBMITTED";
        expect(vm.areSkipControlsVisible()).toBe(true);

        requisitionStatus = "AUTHORIZED";
        expect(vm.areSkipControlsVisible()).toBe(false);

        requisitionStatus = "foo";
        expect(vm.areSkipControlsVisible()).toBe(false);
    });

    it('should only show skip controls if the requisition template has a skip columm', function(){
        // There is a column named skip
        expect(vm.areSkipControlsVisible()).toBe(true);

        columns[0].name = 'foo';

        expect(vm.areSkipControlsVisible()).toBe(false);
    });

});
