describe('RequisitionSummaryCtrl', function() {

    var $filter, calculations, lineItems, vm;

    beforeEach(function() {

        module('requisition-view');

        lineItems = [
            createLineItem(5, 10.30, false, true),
            createLineItem(10, 2.3, false, true),
            createLineItem(3, 4.2, false, false),
            createLineItem(6, 2.3, false, false)
        ];

        inject(function(_$filter_, _calculations_, $controller) {
            $filter = _$filter_;

            calculations = _calculations_;
            spyOn(calculations, 'totalCost').andCallThrough();

            vm = $controller('RequisitionSummaryCtrl', {
                $scope: {
                    requisition: {
                        requisitionLineItems: lineItems
                    }
                }
            });
        });

    });

    describe('calculateFullSupplyCost', function() {

        it('should calculate total cost correctly', function() {
            expect(vm.calculateFullSupplyCost()).toBe(74.5);
        });

        it('should only include full supply line items', function() {
            vm.calculateFullSupplyCost();

            expect(calculations.totalCost).toHaveBeenCalledWith(lineItems[0]);
            expect(calculations.totalCost).toHaveBeenCalledWith(lineItems[1]);
            expect(calculations.totalCost).not.toHaveBeenCalledWith(lineItems[2]);
            expect(calculations.totalCost).not.toHaveBeenCalledWith(lineItems[3]);
        });

        it('should skip skipped lineItems', function() {
            lineItems[0].skipped = true;

            vm.calculateFullSupplyCost();

            expect(calculations.totalCost).not.toHaveBeenCalledWith(lineItems[0]);
        });

    });

    describe('calculateNonFullSupplyCost', function() {

        it('should calculate total cost correctly', function() {
            expect(vm.calculateNonFullSupplyCost()).toBe(26.4);
        });

        it('should only include non full supply line items', function() {
            vm.calculateNonFullSupplyCost();

            expect(calculations.totalCost).not.toHaveBeenCalledWith(lineItems[0]);
            expect(calculations.totalCost).not.toHaveBeenCalledWith(lineItems[1]);
            expect(calculations.totalCost).toHaveBeenCalledWith(lineItems[2]);
            expect(calculations.totalCost).toHaveBeenCalledWith(lineItems[3]);
        });

        it('should skip skipped line items', function() {
            lineItems[2].skipped = true;

            vm.calculateNonFullSupplyCost();

            expect(calculations.totalCost).not.toHaveBeenCalledWith(lineItems[2]);
        });

    });

    describe('calculateTotalCost', function() {

        it('should calculate total cost correctly', function() {
            expect(vm.calculateTotalCost().toFixed(1)).toBe('100.9');
        });

        it('should only include all non-skipped line items', function() {
            vm.calculateTotalCost();

            expect(calculations.totalCost).toHaveBeenCalledWith(lineItems[0]);
            expect(calculations.totalCost).toHaveBeenCalledWith(lineItems[1]);
            expect(calculations.totalCost).toHaveBeenCalledWith(lineItems[2]);
            expect(calculations.totalCost).toHaveBeenCalledWith(lineItems[3]);
        });

        it('should skip skipped line items', function() {
            lineItems[0].skipped = true;
            lineItems[2].skipped = true;

            vm.calculateTotalCost();

            expect(calculations.totalCost).not.toHaveBeenCalledWith(lineItems[0]);
            expect(calculations.totalCost).not.toHaveBeenCalledWith(lineItems[2]);
        });

    });

    function createLineItem(pricePerPack, packsToShip, skipped, fullSupply) {
        return {
            pricePerPack: pricePerPack,
            packsToShip: packsToShip,
            skipped: skipped,
            $program: {
                fullSupply: fullSupply
            }
        };
    }

});
