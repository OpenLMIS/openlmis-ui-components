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

describe('ProofOfDeliveryManageController', function() {

    var vm, orderFactoryMock, $rootScope, loadingModalServiceMock, right, programs,
        facility, user, deferred, orders, facilityService, authorizationService,
        offlineServiceMock, pod, $state;

    beforeEach(function() {

        user = { 'user_id': 'user-one' };

        right = createObjWithId('right-one');

        facility = {
            'id': 'facility-one',
            'supportedPrograms': programs
        }

        programs = [
            createObjWithId('program-one'),
            createObjWithId('program-two')
        ];

        orders = [
            createOrder('order-one', 'RECEIVED'),
            createOrder('order-two', 'PICKING')
        ];

        pod = {
            id: 'pod-one',
            order: { id: 'order-one' }
        };

        module('proof-of-delivery-manage', function($provide) {
            orderFactoryMock = jasmine.createSpyObj('orderFactory', ['search', 'getPod', 'searchOrdersForManagePod']);
            loadingModalServiceMock = jasmine.createSpyObj('loadingModalService', ['open', 'close']);
            offlineServiceMock = jasmine.createSpyObj('offlineService', ['checkConnection', 'isOffline']);

            $provide.factory('orderFactory', function() {
                return orderFactoryMock;
            });

            $provide.factory('loadingModalService', function() {
                return loadingModalServiceMock;
            });

            $provide.factory('offlineService', function() {
                return offlineServiceMock;
            });

        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            deferred = $injector.get('$q').defer();
            $state = $injector.get('$state');
            facilityService = $injector.get('facilityService');
            authorizationService = $injector.get('authorizationService');
            vm = $injector.get('$controller')('ProofOfDeliveryManageController', {
                userId: 'user_one',
                facility: facility,
                homePrograms: programs,
                supervisedPrograms: programs
            });
        });
    });

    describe('initialization', function() {

        it('should assign requesting facility as home facility', function() {
            expect(vm.requestingFacilityId).toEqual(facility.id);
        });

        it('should assign programs as home programs', function() {
            expect(vm.programs).toEqual(programs);
        });

        it('should assign selected program as undefined', function() {
            expect(vm.selectedProgramId).toEqual(undefined);
        });

    });

    describe('loadOrders', function() {

        beforeEach(function() {
            vm.requestingFacilityId = vm.requestingFacilities[0].id;
            vm.selectedProgramId = vm.programs[0].id;

            orderFactoryMock.getPod.andReturn(deferred.promise);
            orderFactoryMock.searchOrdersForManagePod.andReturn(deferred.promise);
        });

        it('should open loading modal', function() {
            vm.loadOrders();

            expect(loadingModalServiceMock.open).toHaveBeenCalled();
        });

        it('should fetch orders from order factory with correct params', function() {
            vm.loadOrders();

            expect(orderFactoryMock.searchOrdersForManagePod).toHaveBeenCalledWith('facility-one', 'program-one');
        });

        it('should set vm.orders', function() {
            vm.loadOrders();
            deferred.resolve(orders);
            $rootScope.$apply();

            expect(vm.orders).toEqual(orders);
        });

        it('should close loading modal', function() {
            vm.loadOrders();
            deferred.resolve();
            $rootScope.$apply();

            expect(loadingModalServiceMock.close).toHaveBeenCalled();
        });
    });

    describe('updateFacilityType', function() {
        it('should load proper data for supervised facility', function() {
            vm.updateFacilityType(true);

            expect(vm.requestingFacilities).toEqual([]);
            expect(vm.programs).toEqual(vm.supervisedPrograms);
            expect(vm.requestingFacilityId).toEqual(undefined);
        });

        it('should load proper data for home facility', function() {
            vm.updateFacilityType(false);

            expect(vm.requestingFacilities).toEqual([facility]);
            expect(vm.programs).toEqual(vm.homePrograms);
            expect(vm.requestingFacilityId).toEqual(facility.id);
        });
    });

    describe('loadFacilitiesForProgram', function() {
        it('should load list of facilities for selected program', function() {
            spyOn(facilityService, 'getUserSupervisedFacilities').andCallThrough();
            spyOn(authorizationService, 'getRightByName').andReturn(right);

            vm.loadFacilitiesForProgram(vm.supervisedPrograms[0]);

            expect(vm.requestingFacilities).toEqual([facility]);
        });

        it('should return empty list of facilities for undefined program', function() {
            vm.loadFacilitiesForProgram(undefined);

            expect(vm.requestingFacilities).toEqual([]);
        });
    });

    describe('openPod', function() {
        it('should change state when user select order to view its POD', function() {
            orderFactoryMock.getPod.andReturn(deferred.promise);
            spyOn($state, 'go');

            vm.openPod('order-one');
            deferred.resolve(pod);
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('orders.podView', {podId: 'pod-one'});
        });
    });

});

function createObjWithId(id) {
    return {
        id: id
    };
}

function createOrder(id, status) {
    return {
        id: id,
        status: status
    };
}
