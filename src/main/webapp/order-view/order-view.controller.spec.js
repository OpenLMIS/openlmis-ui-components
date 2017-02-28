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
        deferred, orders, item, totalItems, stateParams, $controller, $stateParams, orderFactory;

    beforeEach(function() {
        module('order-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $stateParams = $injector.get('$stateParams');
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

        stateParams = {
            page: 0,
            size: 10
        };

        totalItems = 2;
    });

    describe('initialization', function() {

        var $controllerMock;

        beforeEach(function() {
            $controllerMock = jasmine.createSpy('$controller').andCallFake(function() {
                vm.stateParams = {};
            });

            vm = $controller('OrderViewController', {
                supplyingFacilities: supplyingFacilities,
                requestingFacilities: requestingFacilities,
                programs: programs,
                items: items,
                totalItems: totalItems,
                stateParams: stateParams,
                $controller: $controllerMock
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

            vm.stateParams.program = undefined;
            vm.stateParams.requestingFacility = undefined;
            vm.stateParams.supplyingFacility = undefined;

            spyOn(vm, 'changePage').andReturn();
        });

        it('should set program', function() {
            vm.program = {id: 'program-one'};

            vm.loadOrders();

            expect(vm.stateParams.program).toBe(vm.program.id);
        });

        it('should set supplying facility', function() {
            vm.supplyingFacility = {id: 'facility-one'};

            vm.loadOrders();

            expect(vm.stateParams.supplyingFacility).toBe(vm.supplyingFacility.id);
        });

        it('should set requesting facility', function() {
            vm.requestingFacility = {id: 'facility-one'};

            vm.loadOrders();

            expect(vm.stateParams.requestingFacility).toBe(vm.requestingFacility.id);
        });

        it('schould reload state', function() {
           vm.loadOrders();
           expect(vm.changePage).toHaveBeenCalled();
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
                items: items,
                totalItems: totalItems,
                stateParams: stateParams,
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
                items: items,
                totalItems: totalItems,
                stateParams: stateParams,
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
            items: items,
            totalItems: totalItems,
            stateParams: stateParams
        });
        vm.$onInit();
    }
});

function createObjWithId(id) {
    return {
        id: id
    };
}