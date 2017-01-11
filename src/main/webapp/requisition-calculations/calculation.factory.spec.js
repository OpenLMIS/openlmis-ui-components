describe('calculationFactory', function() {

    var calculationFactory, REQUISITION_STATUS, lineItem, requisitionMock;

    beforeEach(module('requisition-calculations'));

    var lineItemInject = inject(function(_calculationFactory_, _REQUISITION_STATUS_) {
        calculationFactory = _calculationFactory_;
        REQUISITION_STATUS = _REQUISITION_STATUS_;

        lineItem = {
            orderableProduct: {},
            totalLossesAndAdjustments: 25,
            beginningBalance: 20,
            totalConsumedQuantity: 15,
            totalReceivedQuantity: 10,
            stockOnHand: 5
        };

        requisitionMock = jasmine.createSpyObj('requisition', ['$isAuthorized']);
    });

    describe('Calculate packs to ship', function(){
        beforeEach(lineItemInject);

        it('should return zero if pack size is zero', function() {
            lineItem.orderableProduct.packSize = 0;

            expect(calculationFactory.packsToShip(lineItem)).toBe(0);
        });

        it('should return zero if approved quantity is zero', function() {
            requisitionMock.$isAuthorized.andReturn(true);

            lineItem.approvedQuantity = 0;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(0);
        });

        it('should return zero if requested quantity is zero', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 0;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(0);
        });

        it('should not round packs to ship if threshold is not exceeded', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 15;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 6;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(1);
        });

        it ('should round packs to ship if threshold is exceeded', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 15;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 4;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(2);
        });

        it ('should return zero if round to zero is set', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 1;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 5;
            lineItem.orderableProduct.roundToZero = true;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(0);
        });

        it ('should return one if round to zero is not set', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 1;
            lineItem.orderableProduct.packSize = 10;
            lineItem.orderableProduct.packRoundingThreshold = 5;
            lineItem.orderableProduct.roundToZero = false;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(1);
        });

        it ('should calculate total properly', function() {
            expect(calculationFactory.total(lineItem)).toBe(30);
        });

        it ('should calculate stock on hand properly', function() {
            expect(calculationFactory.stockOnHand(lineItem)).toBe(40);
        });

        it ('should calculate total consumed quantity', function() {
            expect(calculationFactory.totalConsumedQuantity(lineItem)).toBe(50);
        });

        it ('should calculate total cost', function() {
            lineItem.pricePerPack = 30.20;
            lineItem.packsToShip = 4;

            expect(calculationFactory.totalCost(lineItem)).toBe(120.8);
        });

        it ('should calculate zero total cost if value missing', function() {
            lineItem.pricePerPack = undefined;
            lineItem.packsToShip = 4;

            expect(calculationFactory.totalCost(lineItem)).toBe(0);

            lineItem.pricePerPack = 4;
            lineItem.packsToShip = undefined;

            expect(calculationFactory.totalCost(lineItem)).toBe(0);

            lineItem.pricePerPack = undefined;
            lineItem.packsToShip = undefined;

            expect(calculationFactory.totalCost(lineItem)).toBe(0);
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
            expect(calculationFactory.totalLossesAndAdjustments(lineItem, {})).toBe(0);
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
            expect(calculationFactory.totalLossesAndAdjustments(lineItem, {})).toBe(11);
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
            expect(calculationFactory.totalLossesAndAdjustments(lineItem, {})).toBe(-11);
        });
    });

    describe('Calculate adjusted consumption', function() {
        beforeEach(lineItemInject);
        var period = {
            durationInMonths: 1
        };

        it('should return total consumed quantity when non-stockout days is zero', function() {
            lineItem.totalStockoutDays = 30;
            expect(calculationFactory.adjustedConsumption(lineItem, {processingPeriod: period})).toBe(lineItem.totalConsumedQuantity);
        });

        it('should return zero when consumed quantity is not defined', function() {
            lineItem.totalConsumedQuantity = 0;
            expect(calculationFactory.adjustedConsumption(lineItem, {processingPeriod: period})).toBe(0);
        });

        it('should calculate adjusted consumption', function() {
            lineItem.totalStockoutDays = 15;
            expect(calculationFactory.adjustedConsumption(lineItem, {processingPeriod: period})).toBe(30);
        });
    });

    describe('Calculate Maximum Stock Quantity', function () {
        beforeEach(lineItemInject);

        var column = {
            name: 'maximumStockQuantity',
            option: {
                optionName: 'default'
            }
        }

        it('should return zero if requsition does not exist', function () {
            expect(calculationFactory.maximumStockQuantity(lineItem)).toBe(0);
            expect(calculationFactory.maximumStockQuantity(lineItem, null)).toBe(0);
            expect(calculationFactory.maximumStockQuantity(lineItem, undefined)).toBe(0);
        });

        it('should return zero if requisition does not have template', function () {
            expect(calculationFactory.maximumStockQuantity(lineItem, {})).toBe(0);
        });

        it('should return zero if requisition template does not have columns', function () {
            expect(calculationFactory.maximumStockQuantity(lineItem, { '$template': { } })).toBe(0);
        });

        it('should return zero if requisition template does not contain maximumStockQuantity column', function () {
            expect(calculationFactory.maximumStockQuantity(lineItem, { '$template': { columns: [] } })).toBe(0);
        });

        it ('should return zero if selected option is not equal to default', function () {
            column.option.optionName = 'test_option';
            expect(calculationFactory.maximumStockQuantity(lineItem, { '$template': { columns: [column] } })).toBe(0);
        });

        it('should return maximum stock quantity when default option was selected', function () {
            lineItem.maxMonthsOfStock = 7.25;
            lineItem.averageConsumption = 2;

            column.option.optionName = 'default';

            expect(calculationFactory.maximumStockQuantity(lineItem, { '$template': { columns: [column] } })).toBe(14.5);
        });
    })
});
