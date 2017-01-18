describe('POD', function() {

    var POD, sourceMock, orderMock, proofOfDelivery;

    beforeEach(function() {
        module('proof-of-delivery-view');

        inject(function($injector) {
            POD = $injector.get('ProofOfDelivery');
        });

        sourceMock = jasmine.createSpy('source');
    });

    describe('constructor', function() {

        it('should copy source object', function() {
            spyOn(angular, 'copy').andCallThrough();

            var pod = new POD(sourceMock);

            expect(angular.copy).toHaveBeenCalledWith(sourceMock, pod);
        });
    });

    describe('isLineItemValid', function() {

        beforeEach(function() {
            proofOfDelivery = new POD(sourceMock);
            proofOfDelivery.proofOfDeliveryLineItems = [
                    {
                        quantityReceived: 10
                    }
            ];
        });

        it('should return true when line item is valid', function() {
            expect(proofOfDelivery.isLineItemValid(proofOfDelivery.proofOfDeliveryLineItems[0])).toBe(true);
        });

        it('should return false when line item is not valid', function() {
            proofOfDelivery.proofOfDeliveryLineItems[0].quantityReceived = undefined;
            expect(proofOfDelivery.isLineItemValid(proofOfDelivery.proofOfDeliveryLineItems[0])).toBe(false);
        });
    });

    describe('isValid', function() {

        beforeEach(function() {
            proofOfDelivery = new POD(sourceMock);
            proofOfDelivery.proofOfDeliveryLineItems = [
                {
                    quantityReceived: 10
                },
                {
                    quantityReceived: 20
                }
            ];
            proofOfDelivery.receivedBy = 'someone';
            proofOfDelivery.deliveredBy = 'someone';
            proofOfDelivery.receivedDate = [2017,1,1];
        });

        it('should return true when pod is valid', function() {
            expect(proofOfDelivery.isValid()).toBe(true);
        });

        it('should return false when pod is not valid', function() {
            proofOfDelivery.proofOfDeliveryLineItems[0].quantityReceived = undefined;
            expect(proofOfDelivery.isValid()).toBe(false);
        });
    });
});
