describe('POD', function() {

    var POD, sourceMock, orderMock;

    beforeEach(function() {
        module('proof-of-delivery-view');

        inject(function($injector) {
            POD = $injector.get('ProofOfDelivery');
        });

        sourceMock = jasmine.createSpy('source');
    });

    describe('constructor', function() {

        it('should copy source object', function() {
            spyOn(angular, 'copy').andCallThrough();

            var pod = new POD(sourceMock);

            expect(angular.copy).toHaveBeenCalledWith(sourceMock, pod);
        });
    });

});
