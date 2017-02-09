describe('proofOfDeliveryService', function() {

    var POD_ID = 'some-pod-id';

    var proofOfDeliveryService, $httpBackend, fulfillmentUrlFactory, pod, url;

    beforeEach(function() {
        dateUtilsMock = jasmine.createSpyObj('dateUtils', ['toDate', 'toArray']);

        module('proof-of-delivery-view', function($provide) {
            $provide.service('dateUtils', function() {
                return dateUtilsMock;
            });
        });

        inject(function($injector) {
            proofOfDeliveryService = $injector.get('proofOfDeliveryService');
            $httpBackend = $injector.get('$httpBackend');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
        });

        pod = {
            id: POD_ID,
            receivedDate: new Date(),
            order: {
                createdDate: new Date()
            }
        };

        dateUtilsMock.toDate.andCallFake(parseDateMock);
        dateUtilsMock.toArray.andCallFake(parseDateMock);
    });

    describe('get', function() {

        beforeEach(function() {
            url = fulfillmentUrlFactory('/api/proofOfDeliveries/' + POD_ID);
            $httpBackend.when('GET', url).respond(pod);
        });

        it('should return promise', function() {
            expect(proofOfDeliveryService.get(POD_ID).then).not.toBeUndefined();
            $httpBackend.flush();
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(url);

            proofOfDeliveryService.get(POD_ID);
            $httpBackend.flush();
        });

        it('should call format date method', function() {
            proofOfDeliveryService.get(POD_ID);
            $httpBackend.flush();

            expect(dateUtilsMock.toDate).toHaveBeenCalledWith(pod.receivedDate);
            expect(dateUtilsMock.toDate).toHaveBeenCalledWith(pod.order.createdDate);
        });
    });

    describe('save', function() {

        beforeEach(function() {
            url = fulfillmentUrlFactory('/api/proofOfDeliveries/' + POD_ID);
            $httpBackend.when('PUT', url, pod).respond();
        });

        it('should return promise', function() {
            expect(proofOfDeliveryService.save(pod).then).not.toBeUndefined();
            $httpBackend.flush();
        });

        it('should make a proper request', function() {
            $httpBackend.expectPUT(url, pod);

            proofOfDeliveryService.save(pod);
            $httpBackend.flush();
        });
    });

    describe('submit', function() {

        beforeEach(function() {
            url = fulfillmentUrlFactory('/api/proofOfDeliveries/' + POD_ID + '/submit');
            $httpBackend.when('POST', url).respond(pod);
        });

        it('should return promise', function() {
            expect(proofOfDeliveryService.submit(pod.id).then).not.toBeUndefined();
            $httpBackend.flush();
        });

        it('should make a proper request', function() {
            $httpBackend.expectPOST(url);

            proofOfDeliveryService.submit(pod.id);
            $httpBackend.flush();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    function parseDateMock(date) {
        return date;
    }

});
