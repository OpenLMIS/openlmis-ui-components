describe('podFactory', function() {

    var POD_ID = 'pod-id';

    var podFactory, podServiceMock, orderFactoryMock, $q, $rootScope, pod, PODMock, order;

    beforeEach(function() {
        orderFactoryMock = jasmine.createSpyObj('orderFactory', ['get']);
        podServiceMock = jasmine.createSpyObj('podService', ['get']);
        PODMock = jasmine.createSpy('POD');

        module('order-pod-view', function($provide) {
            $provide.factory('orderFactory', function() {
                return orderFactoryMock;
            });

            $provide.factory('podService', function() {
                return podServiceMock;
            });

            $provide.factory('POD', function() {
                return PODMock;
            });
        });

        inject(function($injector) {
            podFactory = $injector.get('podFactory');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        order = {};

        pod = {
            order: 'order'
        };

        podServiceMock.get.andReturn($q.when(pod));
        orderFactoryMock.get.andReturn($q.when(order));
    });

    describe('get', function() {

        var promise;

        beforeEach(function() {
            promise = podFactory.get(POD_ID);
        });

        it('should fetch pod from the service', function() {
            expect(podServiceMock.get).toHaveBeenCalledWith(POD_ID);
        });

        it('should fetch order from the service', function() {
            $rootScope.$apply();

            expect(orderFactoryMock.get).toHaveBeenCalledWith(pod.order);
        });

        it('should create new POD object', function() {
            $rootScope.$apply();

            expect(PODMock).toHaveBeenCalledWith(pod, order);
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
