/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

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
