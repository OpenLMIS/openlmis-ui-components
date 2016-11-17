describe('CalculationFactory', function() {

    var CalculationFactory, Status;
    var lineItem;
    
    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(_CalculationFactory_, _Status_) {
        CalculationFactory = _CalculationFactory_;
        Status = _Status_;

        lineItem = {
            orderableProduct: {}
        };
    }));

    describe('calculatePacksToShip', function() {

        it('should return zero if pack size is zero', function() {
            lineItem.orderableProduct.packSize = 0;

            expect(CalculationFactory.packsToShip(lineItem)).toBe(0);
        });

        it('should return zero if approved quantity is zero', function() {
            lineItem.approvedQuantity = 0;

            expect(CalculationFactory.packsToShip(lineItem, Status.AUTHORIZED)).toBe(0);
        });

        it('should return zero if requested quantity is zero', function() {
            lineItem.requestedQuantity = 0;

            expect(CalculationFactory.packsToShip(lineItem, Status.SUBMITTED)).toBe(0);
        });

        it('should not round packs to ship if threshold is not exceeded', function() {
            lineItem.requestedQuantity = 15;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 6;

            expect(CalculationFactory.packsToShip(lineItem, Status.SUBMITTED)).toBe(1);
        });

        it ('should round packs to ship if threshold is exceeded', function() {
            lineItem.requestedQuantity = 15;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 5;

            expect(CalculationFactory.packsToShip(lineItem, Status.SUBMITTED)).toBe(2);
        });

        it ('should return zero if round to zero is set', function() {
            lineItem.requestedQuantity = 1;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 5;
            lineItem.orderableProduct.roundToZero = true;

            expect(CalculationFactory.packsToShip(lineItem, Status.SUBMITTED)).toBe(0);
        });

        it ('should return one if round to zero is not set', function() {
            lineItem.requestedQuantity = 1;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 5;
            lineItem.orderableProduct.roundToZero = false;

            expect(CalculationFactory.packsToShip(lineItem, Status.SUBMITTED)).toBe(1);
        });
    });

});