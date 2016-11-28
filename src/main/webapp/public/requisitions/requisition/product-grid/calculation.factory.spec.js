describe('calculations', function() {

    var calculations, Status, lineItem;

    beforeEach(module('openlmis.requisitions'));

    var lineItemInject = inject(function(_calculations_, _Status_) {
        calculations = _calculations_;
        Status = _Status_;

        lineItem = {
            orderableProduct: {},
            totalLossesAndAdjustments: 25,
            beginningBalance: 20,
            totalConsumedQuantity: 15,
            totalReceivedQuantity: 10,
            stockOnHand: 5,
        };
    });

    describe('Calculate packs to ship', function(){
        beforeEach(lineItemInject);

        it('should return zero if pack size is zero', function() {
            lineItem.orderableProduct.packSize = 0;

            expect(calculations.packsToShip(lineItem)).toBe(0);
        });

        it('should return zero if approved quantity is zero', function() {
            lineItem.approvedQuantity = 0;

            expect(calculations.packsToShip(lineItem, Status.AUTHORIZED)).toBe(0);
        });

        it('should return zero if requested quantity is zero', function() {
            lineItem.requestedQuantity = 0;

            expect(calculations.packsToShip(lineItem, Status.SUBMITTED)).toBe(0);
        });

        it('should not round packs to ship if threshold is not exceeded', function() {
            lineItem.requestedQuantity = 15;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 6;

            expect(calculations.packsToShip(lineItem, Status.SUBMITTED)).toBe(1);
        });

        it ('should round packs to ship if threshold is exceeded', function() {
            lineItem.requestedQuantity = 15;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 4;

            expect(calculations.packsToShip(lineItem, Status.SUBMITTED)).toBe(2);
        });

        it ('should return zero if round to zero is set', function() {
            lineItem.requestedQuantity = 1;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 5;
            lineItem.orderableProduct.roundToZero = true;

            expect(calculations.packsToShip(lineItem, Status.SUBMITTED)).toBe(0);
        });

        it ('should return one if round to zero is not set', function() {
            lineItem.requestedQuantity = 1;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 5;
            lineItem.orderableProduct.roundToZero = false;

            expect(calculations.packsToShip(lineItem, Status.SUBMITTED)).toBe(1);
        });

        it ('should calculate total properly', function() {
            expect(calculations.total(lineItem)).toBe(30);
        });

        it ('should calculate stock on hand properly', function() {
            expect(calculations.stockOnHand(lineItem)).toBe(40);
        });

        it ('should calculate total consumed quantity', function() {
            expect(calculations.totalConsumedQuantity(lineItem)).toBe(50);
        });

    });

    describe('Calculate total losses and adjustments', function() {
        var _additive__;
        beforeEach(module(function($provide) {
            var filter = function() {
                return [{
                    additive: _additive_,
                }];
            };

            $provide.value('filterFilter', filter);
        }));

        beforeEach(lineItemInject);

        it ('should return zero when calculating totalLossesAndAdjustments and no reason present', function() {
            expect(calculations.totalLossesAndAdjustments(lineItem, {})).toBe(0);
        });

        it ('should use positive values when calculating totalLossesAndAdjustments and additive parameter is true', function() {
            _additive_ = true;
            lineItem.stockAdjustments = [
                {
                    quantity:10
                },
                {
                    quantity:1
                }
            ];
            expect(calculations.totalLossesAndAdjustments(lineItem, {})).toBe(11);
        });

        it ('should use negative values when calculating totalLossesAndAdjustments and additive parameter is false', function() {
            _additive_ = false;
            lineItem.stockAdjustments = [
                {
                    quantity:10
                },
                {
                    quantity:1
                }
            ];
            expect(calculations.totalLossesAndAdjustments(lineItem, {})).toBe(-11);
        });
    });

});
