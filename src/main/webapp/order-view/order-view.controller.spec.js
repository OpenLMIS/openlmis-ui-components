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

describe('OrderViewController', function() {

    var vm, orderFactoryMock, $rootScope, loadingModalServiceMock, notificationServiceMock,
        fulfillmentUrlFactoryMock, supplyingFacilities, requestingFacilities, programs,
        deferred, orders;

    beforeEach(function() {
        supplyingFacilities = [
            createObjWithId('facility-one'),
            createObjWithId('facility-two')
        ];

        requestingFacilities = [
            createObjWithId('facility-three'),
            createObjWithId('facility-four'),
            createObjWithId('facility-five')
        ];

        programs = [
            createObjWithId('program-one')
        ];

        orders = [
            createObjWithId('order-one'),
            createObjWithId('order-two')
        ];

        module('order-view', function($provide) {
            orderFactoryMock = jasmine.createSpyObj('orderFactory', ['search']);
            loadingModalServiceMock = jasmine.createSpyObj('loadingModalService', ['open', 'close']);
            notificationServiceMock = jasmine.createSpyObj('notificationService', ['error']);
            fulfillmentUrlFactoryMock = jasmine.createSpy();

            $provide.factory('orderFactory', function() {
                return orderFactoryMock;
            });

            $provide.factory('loadingModalService', function() {
                return loadingModalServiceMock;
            });

            $provide.factory('notificationService', function() {
                return notificationServiceMock;
            });

            $provide.factory('fulfillmentUrlFactory', function() {
                return fulfillmentUrlFactoryMock;
            });
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            deferred = $injector.get('$q').defer();
            vm = $injector.get('$controller')('OrderViewController', {
                supplyingFacilities: supplyingFacilities,
                requestingFacilities: requestingFacilities,
                programs: programs
            });
        });

        fulfillmentUrlFactoryMock.andCallFake(function(url) {
            return 'http://some.url' + url;
        });
    });

    describe('initialization', function() {

        it('should expose supplying facilities', function() {
            expect(vm.supplyingFacilities).toEqual(supplyingFacilities);
        });

        it('should expose requesting facilities', function() {
            expect(vm.requestingFacilities).toEqual(requestingFacilities);
        });

        it('should expose programs', function() {
            expect(vm.programs).toEqual(programs);
        });

    });

    describe('loadOrders', function() {

        beforeEach(function() {
            vm.supplyingFacility = vm.supplyingFacilities[0];
            vm.requestingFacility = vm.requestingFacilities[0];
            vm.program = vm.programs[0];

            orderFactoryMock.search.andReturn(deferred.promise);
        });

        it('should open loading modal', function() {
            vm.loadOrders();

            expect(loadingModalServiceMock.open).toHaveBeenCalled();
        });

        it('should fetch orders from order factory with correct params', function() {
            vm.loadOrders();

            expect(orderFactoryMock.search).toHaveBeenCalledWith(
                'facility-one',
                'facility-three',
                'program-one'
            );
        });

        it('should set vm.orders', function() {
            vm.loadOrders();
            deferred.resolve(orders);
            $rootScope.$apply();

            expect(vm.orders).toEqual(orders);
        });

        it('should show error on failed request', function() {
            vm.loadOrders();
            deferred.reject();
            $rootScope.$apply();

            expect(notificationServiceMock.error).toHaveBeenCalledWith('msg.error.occurred');
        });

        it('should close loading modal', function() {
            vm.loadOrders();
            deferred.resolve();
            $rootScope.$apply();

            expect(loadingModalServiceMock.close).toHaveBeenCalled();
        });

    });

    it('getPrintUrl should prepare URL correctly', function() {
        expect(vm.getPrintUrl(orders[0]))
            .toEqual('http://some.url/api/orders/order-one/print?format=pdf');
    });

    it('getDownloadUrl should prepare URL correctly', function() {
        expect(vm.getDownloadUrl(orders[1]))
            .toEqual('http://some.url/api/orders/order-two/export?type=csv');
    });

});

function createObjWithId(id) {
    return {
        id: id
    };
}
