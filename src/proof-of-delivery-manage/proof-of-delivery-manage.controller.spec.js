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

    var vm, orderFactoryMock, facilityFactoryMock, $rootScope, loadingModalServiceMock, programs,
        facility, deferred, pod, $state, $q, $controller,
        $stateParams, $controllerMock, facilities, facilityTwo;

    beforeEach(function() {

        facility = {
            'id': 'facility-one',
            'supportedPrograms': programs
        };

        facilityTwo = {
            'id': 'facility-two',
            'supportedPrograms': programs
        };

        facilities = [facility, facilityTwo];

        programs = [
            createObjWithId('program-one'),
            createObjWithId('program-two')
        ];

        pod = {
            id: 'pod-one',
            order: { id: 'order-one' }
        };

        stateParams = {
            page: 0,
            size: 10
        };

        module('proof-of-delivery-manage', function($provide) {
            orderFactoryMock = jasmine.createSpyObj('orderFactory', ['getPod']);
            facilityFactoryMock = jasmine.createSpyObj('facilityFactory', ['getUserSupervisedFacilities']);
            loadingModalServiceMock = jasmine.createSpyObj('loadingModalService', ['open', 'close']);

            $provide.factory('orderFactory', function() {
                return orderFactoryMock;
            });

            $provide.factory('loadingModalService', function() {
                return loadingModalServiceMock;
            });

            $provide.factory('facilityFactory', function() {
                return facilityFactoryMock;
            });

        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            deferred = $q.defer();
            $state = $injector.get('$state');
            $controller = $injector.get('$controller');
            $stateParams = $injector.get('$stateParams');
            vm = $controller('ProofOfDeliveryManageController', {
                userId: 'user_one',
                facility: facility,
                facilities: facilities,
                homePrograms: programs,
                supervisedPrograms: programs,
                pods: items
            });
        });
    });

    describe('initialization', function() {
        it('should assign requesting facility as home facility', function() {
            vm.$onInit();
            expect(vm.requestingFacilityId).toEqual(facility.id);
            expect(vm.requestingFacilities).toEqual([facility]);
        });

        it('should assign programs as home programs', function() {
            vm.$onInit();
            expect(vm.programs).toEqual(programs);
        });

        it('should assign selected program as undefined', function() {
            vm.$onInit();
            expect(vm.selectedProgramId).toEqual(undefined);
        });

        it('should assign selected program from $stateParams', function() {
            $stateParams.program = 'program';
            facilityFactoryMock.getUserSupervisedFacilities.andReturn(deferred.promise);

            vm.$onInit();

            expect(vm.selectedProgramId).toEqual($stateParams.program);
        });

        it('should load requestingFacilities from dependency when isSupervised is true', function() {
            $stateParams.isSupervised = 'true';

            vm.$onInit();

            expect(vm.requestingFacilities).toEqual(facilities);
        });

        it('should load home facility when isSupervised is false', function() {
            $stateParams.isSupervised = 'false';

            vm.$onInit();

            expect(vm.requestingFacilities).toEqual([facility]);
        });

        it('should assign requestingFacilityId from $stateParams', function() {
            $stateParams.requestingFacility = 'facility-three';
            facilityFactoryMock.getUserSupervisedFacilities.andReturn(deferred.promise);

            vm.$onInit();

            expect(vm.requestingFacilityId).toEqual($stateParams.requestingFacility);
        });

        it('should assign isSupervised from $stateParams', function() {
            $stateParams.isSupervised = 'true';
            facilityFactoryMock.getUserSupervisedFacilities.andReturn(deferred.promise);

            vm.$onInit();

            expect(vm.isSupervised).toEqual(true);
        });
    });

    describe('loadOrders', function() {

        beforeEach(function() {
            vm.$onInit();
            spyOn($state, 'go');
        });

        it('should set requesting facility', function() {
            vm.requestingFacilityId = 'facility-one';
            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('orders.podManage', {
                requestingFacility: vm.requestingFacilityId,
                program: undefined,
                isSupervised: false
            }, {reload: true});
        });

        it('should set program', function() {
            vm.selectedProgramId = 'facility-one';
            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('orders.podManage', {
                requestingFacility: 'facility-one',
                program: vm.selectedProgramId,
                isSupervised: false
            }, {reload: true});
        });

        it('should set requesting facility', function() {
            vm.isSupervised = 'true';
            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('orders.podManage', {
                requestingFacility: 'facility-one',
                program: undefined,
                isSupervised: vm.isSupervised
            }, {reload: true});
        });

        it('should call state go', function() {
            vm.loadOrders();

            expect($state.go).toHaveBeenCalled();
        });
    });

    describe('updateFacilityType', function() {
        it('should load proper data for supervised facility', function() {
            vm.$onInit();
            vm.isSupervised = true;
            vm.updateFacilityType();

            expect(vm.programs).toEqual(vm.supervisedPrograms);
            expect(vm.requestingFacilityId).toEqual(undefined);
        });

        it('should load proper data for home facility', function() {
            vm.$onInit();
            vm.updateFacilityType();

            expect(vm.requestingFacilities).toEqual([facility]);
            expect(vm.programs).toEqual(vm.homePrograms);
            expect(vm.requestingFacilityId).toEqual(facility.id);
        });
    });

    describe('loadFacilitiesForProgram', function() {
        it('should load list of facilities for selected program', function() {
            facilityFactoryMock.getUserSupervisedFacilities.andReturn(deferred.promise);

            vm.loadFacilitiesForProgram('program-one');
            deferred.resolve([facility]);
            $rootScope.$apply();

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

function checkConnection() {
    return $q.when(true);
}
