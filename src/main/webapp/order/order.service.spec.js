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

describe('orderService', function() {

    var orderService, $rootScope, $httpBackend, fulfillmentUrlFactory, orders, pod,
        dateUtilsMock;

    beforeEach(function() {
        module('order', function($provide) {
            dateUtilsMock = jasmine.createSpyObj('dateUtils', ['toDate']);

            $provide.factory('dateUtils', function() {
                return dateUtilsMock;
            });

            dateUtilsMock.toDate.andCallFake(function(array) {
                return new Date(array[0], array[1] - 1, array[2]);
            });
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            orderService = $injector.get('orderService');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
        });

        orders = [{
            id: 'id-one',
            createdDate: [2017, 1, 1],
            processingPeriod: {
                startDate: [2017, 1, 1],
                endDate: [2017, 1, 31]
            }
        }, {
            id: 'id-two',
            createdDate: [2017, 2, 1],
            processingPeriod: {
                startDate: [2017, 2, 1],
                endDate: [2017, 2, 27]
            }
        }];

        pod = {
            id: 'id-three',
            order: { id: 'id-one' },
            receivedDate: [2017, 1, 1]
        };

        $httpBackend.when('GET', fulfillmentUrlFactory('/api/orders/search?supplyingFacility=some-id'))
            .respond(200, {content: orders});

        $httpBackend.when('GET', fulfillmentUrlFactory('/api/orders/id-one/proofOfDeliveries'))
            .respond(200, pod);
    });

    it('search should return transformed orders', function() {
        var result;

        orderService.search({
            supplyingFacility: 'some-id'
        }).then(function(orders) {
            result = orders;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result.content[0].id).toEqual('id-one');
        expect(result.content[0].processingPeriod.startDate).toEqual(new Date(2017, 0, 1));
        expect(result.content[0].processingPeriod.endDate).toEqual(new Date(2017, 0, 31));

        expect(result.content[1].id).toEqual('id-two');
        expect(result.content[1].processingPeriod.startDate).toEqual(new Date(2017, 1, 1));
        expect(result.content[1].processingPeriod.endDate).toEqual(new Date(2017, 1, 27));

    });

    it('search should return transformed proof of deliveries', function() {
        var result;

        orderService.getPod('id-one').then(function(pod) {
            result = pod;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result.id).toEqual('id-three');
        expect(result.receivedDate).toEqual(new Date(2017, 0, 1));

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
