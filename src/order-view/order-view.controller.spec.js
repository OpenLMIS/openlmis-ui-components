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
        deferred, orders, item, $controller, $stateParams, orderFactory;

    beforeEach(function() {
        module('order-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $stateParams = $injector.get('$stateParams');
            $state = $injector.get('$state');
        });

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

        items = [
            'itemOne', 'itemTwo'
        ];
    });

    describe('initialization', function() {

        var $controllerMock;

        beforeEach(function() {
            vm = $controller('OrderViewController', {
                supplyingFacilities: supplyingFacilities,
                requestingFacilities: requestingFacilities,
                programs: programs,
                orders: items
            });
        });

        it('should expose supplying facilities', function() {
            vm.$onInit();
            expect(vm.supplyingFacilities).toEqual(supplyingFacilities);
        });

        it('should expose requesting facilities', function() {
            vm.$onInit();
            expect(vm.requestingFacilities).toEqual(requestingFacilities);
        });

        it('should expose programs', function() {
            vm.$onInit();
            expect(vm.programs).toEqual(programs);
        });

    });

    describe('loadOrders', function() {

        beforeEach(function() {
            initController();
            vm.$onInit();
            spyOn($state, 'go').andReturn();
        });

        it('should set program', function() {
            vm.program = {id: 'program-one'};

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('orders.view', {
                supplyingFacility: null,
                program: vm.program.id,
                requestingFacility: null
            }, {reload: true});
        });

        it('should set supplying facility', function() {
            vm.supplyingFacility = {id: 'facility-one'};

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('orders.view', {
                supplyingFacility: vm.supplyingFacility.id,
                program: null,
                requestingFacility: null
            }, {reload: true});
        });

        it('should set requesting facility', function() {
            vm.requestingFacility = {id: 'facility-one'};

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('orders.view', {
                supplyingFacility: null,
                program: null,
                requestingFacility: vm.requestingFacility.id
            }, {reload: true});
        });

        it('should reload state', function() {
           vm.loadOrders();
           expect($state.go).toHaveBeenCalled();
        });

    });

    describe('getPrintUrl', function() {

        beforeEach(function() {
            fulfillmentUrlFactoryMock = jasmine.createSpy();
            fulfillmentUrlFactoryMock.andCallFake(function(url) {
                return 'http://some.url' + url;
            });

            vm = $controller('OrderViewController', {
                supplyingFacilities: supplyingFacilities,
                requestingFacilities: requestingFacilities,
                programs: programs,
                orders: items,
                fulfillmentUrlFactory: fulfillmentUrlFactoryMock
            });
        });

        it('should prepare print URL correctly', function () {
            expect(vm.getPrintUrl(orders[0]))
                .toEqual('http://some.url/api/orders/order-one/print?format=pdf');
        });
    });

    describe('getDownloadUrl', function() {

        beforeEach(function() {
            fulfillmentUrlFactoryMock = jasmine.createSpy();
            fulfillmentUrlFactoryMock.andCallFake(function(url) {
                return 'http://some.url' + url;
            });

            vm = $controller('OrderViewController', {
                supplyingFacilities: supplyingFacilities,
                requestingFacilities: requestingFacilities,
                programs: programs,
                orders: items,
                fulfillmentUrlFactory: fulfillmentUrlFactoryMock
            });
        });

        it('should prepare download URL correctly', function () {
            expect(vm.getDownloadUrl(orders[1]))
                .toEqual('http://some.url/api/orders/order-two/export?type=csv');
        });
    });

    function initController() {
        vm = $controller('OrderViewController', {
            supplyingFacilities: supplyingFacilities,
            requestingFacilities: requestingFacilities,
            programs: programs,
            orders: items
        });
        vm.$onInit();
    }
});

function createObjWithId(id) {
    return {
        id: id
    };
}
