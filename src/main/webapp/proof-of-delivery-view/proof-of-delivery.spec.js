describe('POD', function() {

    var POD, sourceMock, orderMock, proofOfDelivery, pod;

    beforeEach(function() {
        module('proof-of-delivery-view');

        inject(function($injector) {
            POD = $injector.get('ProofOfDelivery');
        });

        sourceMock = jasmine.createSpy('source');

        pod = {
            proofOfDeliveryLineItems: [
                {
                    quantityReceived: 10,
                    orderLineItem: {
                        orderable: {
                            programs: [
                                {
                                    programId: '1'
                                }
                            ]
                        }
                    }
                },
                {
                    quantityReceived: 20,
                    orderLineItem: {
                        orderable: {
                            programs: [
                                {
                                    programId: '1'
                                }
                            ]
                        }
                    }
                }
            ],
            order: {
                program: {
                    id: '1'
                }
            },
            receivedBy: 'someone',
            deliveredBy: 'someone',
            receivedDate: [2017,1,1]
        };
    });

    describe('constructor', function() {

        it('should copy source object', function() {
            spyOn(angular, 'copy').andCallThrough();

            var ProofOfDelivery = new POD(sourceMock);

            expect(angular.copy).toHaveBeenCalledWith(sourceMock, ProofOfDelivery);
        });
    });

    describe('isLineItemValid', function() {

        beforeEach(function() {
            proofOfDelivery = new POD(pod);
        });

        it('should return true when line item is valid', function() {
            proofOfDelivery.proofOfDeliveryLineItems[0].validate();
            expect(proofOfDelivery.isLineItemValid(proofOfDelivery.proofOfDeliveryLineItems[0])).toBe(true);
        });

        it('should return false when line item is not valid', function() {
            proofOfDelivery.proofOfDeliveryLineItems[0].quantityReceived = undefined;
            proofOfDelivery.proofOfDeliveryLineItems[0].validate();
            expect(proofOfDelivery.isLineItemValid(proofOfDelivery.proofOfDeliveryLineItems[0])).toBe(false);
        });
    });

    describe('isValid', function() {

        beforeEach(function() {
            proofOfDelivery = new POD(pod);
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
