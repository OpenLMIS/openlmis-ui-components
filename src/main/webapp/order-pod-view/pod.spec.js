describe('POD', function() {

    var POD, sourceMock, orderMock;

    beforeEach(function() {
        module('order-pod-view');

        inject(function($injector) {
            POD = $injector.get('POD');
        });

        sourceMock = jasmine.createSpy('source');
        orderMock = jasmine.createSpy('order');
    });

    describe('constructor', function() {

        it('should copy source object', function() {
            spyOn(angular, 'copy').andCallThrough();

            var pod = new POD(sourceMock, orderMock);

            expect(angular.copy).toHaveBeenCalledWith(sourceMock, pod);
        });

        it('should set order property', function() {
            var pod = new POD(sourceMock, orderMock);

            expect(pod.order).toEqual(orderMock);
        });

    });

});
