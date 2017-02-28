/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

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
        var searchParams = {
            program: 'id-one',
            supplyingFacility: 'id-two',
            requestingFacility: 'id-three'
        };
        orderFactory.search(searchParams);

        expect(orderServiceMock.search).toHaveBeenCalledWith(searchParams);
    });

    it('should call orderService with only one param', function() {
        var searchParam = {
            supplyingFacility: 'id-two',
        };
        orderFactory.search(searchParam);

        expect(orderServiceMock.search).toHaveBeenCalledWith(searchParam);
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
