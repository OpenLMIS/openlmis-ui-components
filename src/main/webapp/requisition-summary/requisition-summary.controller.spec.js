describe('RequisitionSummaryController', function() {

    var $filter, calculationFactory, lineItems, vm;

    beforeEach(function() {

        module('requisition-summary');

        lineItems = [
            createLineItem(5, 10.30, false, true),
            createLineItem(10, 2.3, false, true),
            createLineItem(3, 4.2, false, false),
            createLineItem(6, 2.3, false, false)
        ];

        inject(function(_$filter_, _calculationFactory_, $controller) {
            $filter = _$filter_;

            calculationFactory = _calculationFactory_;
            spyOn(calculationFactory, 'totalCost').andCallThrough();

            vm = $controller('RequisitionSummaryController', {
                $scope: {
                    requisition: {
                        requisitionLineItems: lineItems,
                        template: {
                            showNonFullSupplyTab: true
                        }
                    }
                }
            });
        });

    });

    describe('initialization', function() {

        it('should expose requistion', function() {
            expect(vm.requisition).not.toBeUndefined();
        });


        it('should set showNonFullSupplySummary property', function() {
            expect(vm.showNonFullSupplySummary).not.toBeUndefined();
        });

    });

    describe('calculateFullSupplyCost', function() {

        it('should calculate total cost correctly', function() {
            expect(vm.calculateFullSupplyCost()).toBe(74.5);
        });

        it('should only include full supply line items', function() {
            vm.calculateFullSupplyCost();

            expect(calculationFactory.totalCost).toHaveBeenCalledWith(lineItems[0]);
            expect(calculationFactory.totalCost).toHaveBeenCalledWith(lineItems[1]);
            expect(calculationFactory.totalCost).not.toHaveBeenCalledWith(lineItems[2]);
            expect(calculationFactory.totalCost).not.toHaveBeenCalledWith(lineItems[3]);
        });

        it('should skip skipped lineItems', function() {
            lineItems[0].skipped = true;

            vm.calculateFullSupplyCost();

            expect(calculationFactory.totalCost).not.toHaveBeenCalledWith(lineItems[0]);
        });

    });

    describe('calculateNonFullSupplyCost', function() {

        it('should calculate total cost correctly', function() {
            expect(vm.calculateNonFullSupplyCost()).toBe(26.4);
        });

        it('should only include non full supply line items', function() {
            vm.calculateNonFullSupplyCost();

            expect(calculationFactory.totalCost).not.toHaveBeenCalledWith(lineItems[0]);
            expect(calculationFactory.totalCost).not.toHaveBeenCalledWith(lineItems[1]);
            expect(calculationFactory.totalCost).toHaveBeenCalledWith(lineItems[2]);
            expect(calculationFactory.totalCost).toHaveBeenCalledWith(lineItems[3]);
        });

        it('should skip skipped line items', function() {
            lineItems[2].skipped = true;

            vm.calculateNonFullSupplyCost();

            expect(calculationFactory.totalCost).not.toHaveBeenCalledWith(lineItems[2]);
        });

    });

    describe('calculateTotalCost', function() {

        it('should calculate total cost correctly', function() {
            expect(vm.calculateTotalCost().toFixed(1)).toBe('100.9');
        });

        it('should only include all non-skipped line items', function() {
            vm.calculateTotalCost();

            expect(calculationFactory.totalCost).toHaveBeenCalledWith(lineItems[0]);
            expect(calculationFactory.totalCost).toHaveBeenCalledWith(lineItems[1]);
            expect(calculationFactory.totalCost).toHaveBeenCalledWith(lineItems[2]);
            expect(calculationFactory.totalCost).toHaveBeenCalledWith(lineItems[3]);
        });

        it('should skip skipped line items', function() {
            lineItems[0].skipped = true;
            lineItems[2].skipped = true;

            vm.calculateTotalCost();

            expect(calculationFactory.totalCost).not.toHaveBeenCalledWith(lineItems[0]);
            expect(calculationFactory.totalCost).not.toHaveBeenCalledWith(lineItems[2]);
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
