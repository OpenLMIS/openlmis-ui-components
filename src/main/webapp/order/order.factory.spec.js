describe('orderFactory', function() {

    var $q, orderFactory, orderServiceMock, ORDER_STATUS;

    beforeEach(function() {
        module('order', function($provide) {
            orderServiceMock = createMock($provide, 'orderService', ['search', 'getPod', 'searchOrdersForManagePod']);
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            ORDER_STATUS = $injector.get('ORDER_STATUS');
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

    it('should call orderService with id param', function() {
        orderServiceMock.search.andReturn($q.when());
        orderFactory.searchOrdersForManagePod('id-one', 'id-two');

        expect(orderServiceMock.search).toHaveBeenCalledWith({
            requestingFacility: 'id-one',
            program: 'id-two',
            status: [
                ORDER_STATUS.PICKED,
                ORDER_STATUS.TRANSFER_FAILED,
                ORDER_STATUS.READY_TO_PACK,
                ORDER_STATUS.ORDERED,
                ORDER_STATUS.RECEIVED
            ]
        });
    });

});

function createMock($provide, name, methods) {
    mock = jasmine.createSpyObj(name, methods);
    $provide.factory(name, function() {
        return mock;
    });
    return mock;
}
