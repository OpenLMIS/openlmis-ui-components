describe('orderFactory', function() {

    var $q, orderFactory, orderServiceMock;

    beforeEach(function() {
        module('order', function($provide) {
            orderServiceMock = createMock($provide, 'orderService', ['search', 'getPod']);
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            orderFactory = $injector.get('orderFactory');
        });
    });

    it('should call orderService with correct params', function() {
        orderFactory.search('id-one', 'id-two', 'id-three');

        expect(orderServiceMock.search).toHaveBeenCalledWith({
            supplyingFacility: 'id-one',
            requestingFacility: 'id-two',
            program: 'id-three'
        });
    });

    it('should call orderService with only one param', function() {
        orderFactory.search('id-one');

        expect(orderServiceMock.search).toHaveBeenCalledWith({
            supplyingFacility: 'id-one'
        });
    });

    it('should call orderService with id param', function() {
        orderFactory.getPod('id-one');

        expect(orderServiceMock.getPod).toHaveBeenCalledWith('id-one');
    });

});

function createMock($provide, name, methods) {
    mock = jasmine.createSpyObj(name, methods);
    $provide.factory(name, function() {
        return mock;
    });
    return mock;
}
