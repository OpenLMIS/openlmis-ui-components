describe('podService', function() {

    var POD_ID = 'some-pod-id';

    var podService, $httpBackend, ordersUrlFactory, pod, url;

    beforeEach(function() {
        module('order-pod-view');

        inject(function($injector) {
            podService = $injector.get('podService');
            $httpBackend = $injector.get('$httpBackend');
            ordersUrlFactory = $injector.get('ordersUrlFactory');
        });

        pod = {
            id: POD_ID
        };
    });

    describe('get', function() {

        beforeEach(function() {
            url = ordersUrlFactory('/api/proofOfDeliveries/' + POD_ID);
            $httpBackend.when('GET', url).respond();
        });

        it('should return promise', function() {
            expect(podService.get(POD_ID).then).not.toBeUndefined();
            $httpBackend.flush();
        });

        it('should make a proper request ', function() {
            $httpBackend.expectGET(url);

            podService.get(POD_ID);
            $httpBackend.flush();
        });

    });

    describe('save', function() {

        beforeEach(function() {
            url = ordersUrlFactory('/api/proofOfDeliveries/' + POD_ID);
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

    });

    describe('submit', function() {

        beforeEach(function() {
            url = ordersUrlFactory('/api/proofOfDeliveries/' + POD_ID + '/submit');
            $httpBackend.when('PUT', url, pod).respond();
        });

        it('should return promise', function() {
            expect(podService.submit(pod).then).not.toBeUndefined();
            $httpBackend.flush();
        });

        it('should make a proper request', function() {
            $httpBackend.expectPUT(url, pod);

            podService.submit(pod);
            $httpBackend.flush();
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
