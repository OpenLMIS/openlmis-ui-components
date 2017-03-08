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
describe('RequisitionSearchController', function() {

    var vm, $q, $rootScope, $controller, $stateParams, $state, offlineService, confirmService,
        facilities, items, stateParams, totalItems;

    beforeEach(function() {
        module('requisition-search');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $stateParams = $injector.get('$stateParams');
            $state = $injector.get('$state');
            offlineService = $injector.get('offlineService');
            confirmService = $injector.get('confirmService');
        });

        facilities = [{
            name: 'facilityOne',
            id: 'facility-one'
        }, {
            name: 'facilityTwo',
            id: 'facility-two',
            supportedPrograms: [{
                name: 'programOne',
                id: 'program-one'
            }, {
                name: 'programTwo',
                id: 'program-two'
            }]
        }];

        items = [
            'itemOne', 'itemTwo'
        ];

        stateParams = {
            page: 0,
            size: 10
        };

        totalItems = 2;
    });

    describe('$onInit', function() {

        var $controllerMock;

        beforeEach(function() {
            $controllerMock = jasmine.createSpy('$controller').andCallFake(function() {
                vm.stateParams = {};
            });

            vm = $controller('RequisitionSearchController', {
                items: items,
                facilities: facilities,
                totalItems: totalItems,
                stateParams: stateParams,
                $controller: $controllerMock
            });

        });

        it('should extend BasePaginationController', function() {
            vm.$onInit();

            expect($controllerMock).toHaveBeenCalledWith('BasePaginationController', {
                vm: vm,
                items: items,
                totalItems: totalItems,
                stateParams: stateParams,
                externalPagination: true,
                itemValidator: undefined
            });
        });

        it('should expose facilities', function() {
            vm.$onInit();

            expect(vm.facilities).toBe(facilities);
        });

        it('should set searchOffline to true if true was passed through state parameters', function() {
            $stateParams.offline = 'true';

            vm.$onInit();

            expect(vm.stateParams.offline).toEqual(true);
        });

        it('should set searchOffline to true if application is in offline mode', function() {
            spyOn(offlineService, 'isOffline').andReturn(true);

            vm.$onInit();

            expect(vm.stateParams.offline).toEqual(true);
        });

        it('should set searchOffline to false if false was passed the URL and application is not in offline mode', function() {
            $stateParams.offline = 'false';
            spyOn(offlineService, 'isOffline').andReturn(false);

            vm.$onInit();

            expect(vm.stateParams.offline).toEqual(false);
        });

        it('should set selectedFacility if facility ID was passed the URL', function() {
            $stateParams.facility = 'facility-two';

            vm.$onInit();

            expect(vm.selectedFacility).toBe(facilities[1]);
        });

        it('should not set selectedFacility if facility ID was not passed through the URL', function() {
            $stateParams.facility = undefined;

            vm.$onInit();

            expect(vm.selectedFacility).toBeUndefined();
        });

        it('should set selectedProgram if program and facility ID were passed through the URL', function() {
            $stateParams.facility = 'facility-two';
            $stateParams.program = 'program-two';

            vm.$onInit();

            expect(vm.selectedProgram).toBe(facilities[1].supportedPrograms[1]);
        });

        it('should not set selectedProgram if facility ID was not passed through the URL', function() {
            $stateParams.facility = undefined;

            vm.$onInit();

            expect(vm.selectedProgram).toBeUndefined();
        });

        it('should not set selected program if program ID was not passed through the URL', function() {
            $stateParams.facility = 'facility-two';
            $stateParams.program = undefined;

            vm.$onInit();

            expect(vm.selectedProgram).toBeUndefined();
        });

        it('should set startDate if initiated date from was passed through the URL', function() {
            $stateParams.initiatedDateFrom = '2017-01-31T23:00:00.000Z';

            vm.$onInit();

            expect(vm.startDate).toEqual(new Date('2017-01-31T23:00:00.000Z'));
        });

        it('should not set starDate if initiated date from not passed through the URL', function() {
            $stateParams.initiatedDateFrom = undefined;

            vm.$onInit();

            expect(vm.starDate).toBeUndefined();
        });

        it('should set endDate if initiated date to was passed through the URL', function() {
            $stateParams.initiatedDateTo = '2017-01-31T23:00:00.000Z';

            vm.$onInit();

            expect(vm.endDate).toEqual(new Date('2017-01-31T23:00:00.000Z'));
        });

        it('should not set endDate if initiated date to not passed through the URL', function() {
            $stateParams.initiatedDateTo = undefined;

            vm.$onInit();

            expect(vm.endDate).toBeUndefined();
        });

    });

    describe('search', function() {

        beforeEach(function() {
            initController();
            vm.$onInit();

            vm.stateParams.program = undefined;
            vm.stateParams.facility = undefined;
            vm.stateParams.initiatedDateFrom = undefined;
            vm.stateParams.initiatedDateTo = undefined;
            vm.stateParams.offline = undefined;

            spyOn(vm, 'changePage').andReturn();
        });

        it('should set program', function() {
            vm.selectedProgram = {
                name: 'programOne',
                id: 'program-one'
            };

            vm.search();

            expect(vm.stateParams.program).toBe(vm.selectedProgram.id);
        });

        it('should set facility', function() {
            vm.selectedFacility = {
                name: 'facilityOne',
                id: 'facility-one'
            };

            vm.search();

            expect(vm.stateParams.facility).toBe(vm.selectedFacility.id);
        });

        it('should set initiatedDateFrom', function() {
            vm.startDate = new Date('2017-01-31T23:00:00.000Z');

            vm.search();

            expect(vm.stateParams.initiatedDateFrom).toEqual('2017-01-31T23:00:00.000Z');
        });

        it('should set initiatedDateTo', function() {
            vm.endDate = new Date('2017-01-31T23:00:00.000Z');

            vm.search();

            expect(vm.stateParams.initiatedDateTo).toEqual('2017-01-31T23:00:00.000Z');
        });

        it('should set offline', function() {
            vm.stateParams.offline = true;

            vm.search();

            expect(vm.stateParams.offline).toBe(true);
        });

        it('should reload state', function() {
            vm.search();

            expect(vm.changePage).toHaveBeenCalled();
        });

    });

    describe('openRnr', function() {

        beforeEach(function() {
            initController();
        });

        it('should go to requisitions.requisition.fullSupply state', function() {
            spyOn($state, 'go').andReturn();

            vm.openRnr('requisition-id');

            expect($state.go).toHaveBeenCalledWith('requisitions.requisition.fullSupply', {
                rnr: 'requisition-id'
            });
        });

    });

    describe('removeOfflineRequisition', function() {

        var requisition, confirmPromise, localStorageFactoryMock, offlineRequisitionsMock;

        beforeEach(function() {
            offlineRequisitionsMock = jasmine.createSpyObj('offlineRequisitions', ['removeBy']);
            localStorageFactoryMock = jasmine.createSpy('localStorageFactory');

            localStorageFactoryMock.andReturn(offlineRequisitionsMock);

            vm = $controller('RequisitionSearchController', {
                items: items,
                facilities: facilities,
                totalItems: totalItems,
                stateParams: stateParams,
                localStorageFactory: localStorageFactoryMock
            });

            requisition = {
                id: 'requisition-id',
            };

            confirmDeferred = $q.defer();

            spyOn(confirmService, 'confirmDestroy').andReturn(confirmDeferred.promise);
        });

        it('should require confirmation', function() {
            vm.removeOfflineRequisition(requisition);

            expect(confirmService.confirmDestroy).toHaveBeenCalled();
        });

        it('should remove requisition after confirmation', function() {
            vm.removeOfflineRequisition(requisition);
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(offlineRequisitionsMock.removeBy).toHaveBeenCalledWith('id', requisition.id);
            expect(requisition.$availableOffline).toBe(false);
        });

        it('should not remove requisition without confirmation', function() {
            vm.removeOfflineRequisition(requisition);
            confirmDeferred.reject();
            $rootScope.$apply();

            expect(offlineRequisitionsMock.removeBy).not.toHaveBeenCalled();
            expect(requisition.$availableOffline).not.toBe(false);
        });

    });

    describe('isOfflineDisabled', function() {

        beforeEach(function() {
            initController();
        });

        it('should return true if application is offline', function() {
            spyOn(offlineService, 'isOffline').andReturn(true);

            var result = vm.isOfflineDisabled();

            expect(result).toBe(true);
        });

        it('should set searchOffline to true if application goes in the offline mode', function() {
            spyOn(offlineService, 'isOffline').andReturn(true);

            vm.isOfflineDisabled();

            expect(vm.stateParams.offline).toBe(true);
        });

        it('should return false if application is online', function() {
            spyOn(offlineService, 'isOffline').andReturn(false);

            var result = vm.isOfflineDisabled();

            expect(result).toBe(false);
        });

        it('should not change searchOffline if application is online', function() {
            spyOn(offlineService, 'isOffline').andReturn(false);
            vm.stateParams.offline = false;

            vm.isOfflineDisabled();

            expect(vm.stateParams.offline).toBe(false);

            vm.stateParams.offline = true;

            vm.isOfflineDisabled();

            expect(vm.stateParams.offline).toBe(true);
        });

    });

    function initController() {
        vm = $controller('RequisitionSearchController', {
            items: items,
            facilities: facilities,
            totalItems: totalItems,
            stateParams: stateParams
        });
        vm.$onInit();
    }

});
