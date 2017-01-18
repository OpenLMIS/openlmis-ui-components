describe('podFactory', function() {

    var POD_ID = 'pod-id';

    var podFactory, podServiceMock, $q, $rootScope, pod, PODMock;

    beforeEach(function() {
        podServiceMock = jasmine.createSpyObj('podService', ['get']);
        PODMock = jasmine.createSpy('POD');

        module('proof-of-delivery-view', function($provide) {
            $provide.factory('orderFactory', function() {
                return orderFactoryMock;
            });

            $provide.factory('podService', function() {
                return podServiceMock;
            });

            $provide.factory('ProofOfDelivery', function() {
                return PODMock;
            });
        });

        inject(function($injector) {
            podFactory = $injector.get('podFactory');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        pod = {
            order: 'order'
        };

        podServiceMock.get.andReturn($q.when(pod));
    });

    describe('get', function() {

        var promise;

        beforeEach(function() {
            promise = podFactory.get(POD_ID);
        });

        it('should fetch pod from the service', function() {
            expect(podServiceMock.get).toHaveBeenCalledWith(POD_ID);
        });

        it('should create new POD object', function() {
            $rootScope.$apply();

            expect(PODMock).toHaveBeenCalledWith(pod);
        });

        it('should resolve to pod', function() {
            var resolved;

            promise.then(function(pod) {
                resolved = pod;
            });

            $rootScope.$apply();
            $rootScope.$apply();

            expect(resolved).not.toBeUndefined();
        });

    });

});
