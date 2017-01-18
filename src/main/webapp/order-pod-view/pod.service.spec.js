describe('podService', function() {

    var POD_ID = 'some-pod-id';

    var podService, $httpBackend, fullfilmentUrlFactory, pod, url;

    beforeEach(function() {
        dateUtilsMock = jasmine.createSpyObj('dateUtils', ['toDate', 'toArray']);

        module('proof-of-delivery-view', function($provide) {
            $provide.service('dateUtils', function() {
                return dateUtilsMock;
            });
        });

        inject(function($injector) {
            podService = $injector.get('podService');
            $httpBackend = $injector.get('$httpBackend');
            fullfilmentUrlFactory = $injector.get('fullfilmentUrlFactory');
        });

        pod = {
            id: POD_ID,
            receivedDate: [2017, 1, 17],
            order: {
                createdDate: [2017, 1, 17]
            }
        };

        dateUtilsMock.toDate.andCallFake(parseDateMock);
        dateUtilsMock.toArray.andCallFake(parseDateMock);
    });

    describe('get', function() {

        beforeEach(function() {
            url = fullfilmentUrlFactory('/api/proofOfDeliveries/' + POD_ID);
            $httpBackend.when('GET', url).respond(pod);
        });

        it('should return promise', function() {
            expect(podService.get(POD_ID).then).not.toBeUndefined();
            $httpBackend.flush();
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(url);

            podService.get(POD_ID);
            $httpBackend.flush();
        });

        it('should call format date method', function() {
            podService.get(POD_ID);
            $httpBackend.flush();

            expect(dateUtilsMock.toDate).toHaveBeenCalledWith(pod.receivedDate);
            expect(dateUtilsMock.toDate).toHaveBeenCalledWith(pod.order.createdDate);
        });
    });

    describe('save', function() {

        beforeEach(function() {
            url = fullfilmentUrlFactory('/api/proofOfDeliveries/' + POD_ID);
            $httpBackend.when('PUT', url, pod).respond();
        });

        it('should return promise', function() {
            expect(podService.save(pod).then).not.toBeUndefined();
            $httpBackend.flush();
        });

        it('should make a proper request', function() {
            $httpBackend.expectPUT(url, pod);

            podService.save(pod);
            $httpBackend.flush();
        });

        it('should call format date method', function() {
            podService.save(pod);
            $httpBackend.flush();

            expect(dateUtilsMock.toArray).toHaveBeenCalledWith(pod.receivedDate);
            expect(dateUtilsMock.toArray).toHaveBeenCalledWith(pod.order.createdDate);
        });
    });

    describe('submit', function() {

        beforeEach(function() {
            url = fullfilmentUrlFactory('/api/proofOfDeliveries/' + POD_ID + '/submit');
            $httpBackend.when('PUT', url, pod).respond();
        });

        it('should return promise', function() {
            expect(podService.submit(pod).then).not.toBeUndefined();
            $httpBackend.flush();
        });

        it('should make a proper request', function() {
            $httpBackend.expectPUT(url);

            podService.submit(pod);
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
