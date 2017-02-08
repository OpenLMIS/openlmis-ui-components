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
            processingPeriod: {
                startDate: [2017, 1, 1],
                endDate: [2017, 1, 31]
            }
        }, {
            id: 'id-two',
            processingPeriod: {
                startDate: [2017, 2, 1],
                endDate: [2017, 2, 27]
            }
        }];

        pod = [{
            id: 'id-three',
            order: { id: 'id-one' },
            receivedDate: [2017, 1, 1]
        }];

        $httpBackend.when('GET', fulfillmentUrlFactory('/api/orders/search?supplyingFacility=some-id'))
            .respond(200, orders);

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

        expect(result[0].id).toEqual('id-one');
        expect(result[0].processingPeriod.startDate).toEqual(new Date(2017, 0, 1));
        expect(result[0].processingPeriod.endDate).toEqual(new Date(2017, 0, 31));

        expect(result[1].id).toEqual('id-two');
        expect(result[1].processingPeriod.startDate).toEqual(new Date(2017, 1, 1));
        expect(result[1].processingPeriod.endDate).toEqual(new Date(2017, 1, 27));

    });

    it('search should return transformed proof of deliveries', function() {
        var result;

        orderService.getPod('id-one').then(function(pods) {
            result = pods;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result[0].id).toEqual('id-three');
        expect(result[0].receivedDate).toEqual(new Date(2017, 0, 1));

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
