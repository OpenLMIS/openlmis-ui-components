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

describe('ConvertToOrderController', function(){

    var vm, $rootScope, $q, $stateParams, requisitionService, notificationService,
        requisitions, supplyingDepots, stateParams;

    beforeEach( function() {
        module('requisition-convert-to-order');

        inject(function ($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            requisitionService = $injector.get('requisitionService');
            notificationService = $injector.get('notificationService');
            $state = $injector.get('$state');

            stateParams = {
                filterBy: 'all',
                filterValue: '',
                page: 0,
                size: 10
            };
            requisitions = [
                {
                    requisition: {
                    id: 'requisitionId1',
                    facility: {
                        name: 'facility1',
                        code: 'code1'
                    },
                    program: {
                        name: 'program1'
                    }
                    },
                    supplyingDepots: supplyingDepots
                },
                {
                    requisition: {
                    id: 'requisitonId2',
                    facility: {
                        name: 'facility2',
                        code: 'code2'
                    },
                    program: {
                        name: 'program2'
                    }
                    },
                    supplyingDepots: supplyingDepots
                }
            ];
            supplyingDepots = [
                {
                    id: 'depotId1',
                    name: 'facility1',
                    code: 'code1'
                },
                {
                    id: 'depotId2',
                    name: 'facility2',
                    code: 'code2'
                }
            ];

            vm = $injector.get('$controller')('ConvertToOrderController', {
                items: requisitions,
                $stateParams: stateParams
            });
        });
    });

    it('should show all requisitions if default filter is applied', function() {
        expect(vm.filterBy).toEqual('all');
        expect(vm.filterValue).toEqual('');
        expect(vm.items).toEqual(requisitions);
    });

    it('should get all selected requisitions', function() {
        vm.items[0].$selected = true;

        var selectedRequisitions = vm.getSelected();

        expect(selectedRequisitions).toEqual([requisitions[0]]);
    });

    it('should get an empty array if no requisition is selected', function() {
        var selectedRequisitions = vm.getSelected();

        expect(selectedRequisitions).toEqual([]);
    });

    describe('convertToOrder', function() {
        var confirmService, loadingModalService, confirmDeferred, convertDeferred, loadingDeferred;

        beforeEach(function() {
            inject(function($injector) {
                confirmService = $injector.get('confirmService');
                loadingModalService = $injector.get('loadingModalService');
            });

            confirmDeferred = $q.defer();
            convertDeferred = $q.defer();
            loadingDeferred = $q.defer();

            spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
            spyOn(loadingModalService, 'close').andReturn();
            spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
            spyOn(requisitionService, 'convertToOrder').andReturn(convertDeferred.promise);
            spyOn(notificationService, 'error').andReturn();
            spyOn(notificationService, 'success').andReturn();
        });

        it('should show error if no requisition is selected', function() {
            vm.convertToOrder();

            expect(notificationService.error).toHaveBeenCalledWith('msg.select.at.least.one.rnr');
        });

        it('should not call requisitionService if no requisition is selected', function() {
            vm.convertToOrder();
            confirmDeferred.resolve();
            convertDeferred.resolve();
            $rootScope.$apply();

            expect(requisitionService.convertToOrder).not.toHaveBeenCalled();
        });

        it('should show error if requisition does not have facility selected', function() {
            vm.items[0].$selected = true;

            vm.convertToOrder();

            expect(notificationService.error).toHaveBeenCalledWith('msg.noSupplyingDepotSelected');
        });

        it('should not call requisitionService if requisition does not have facility selected', function() {
            vm.items[0].$selected = true;

            vm.convertToOrder();
            confirmDeferred.resolve();
            convertDeferred.resolve();
            $rootScope.$apply();

            expect(requisitionService.convertToOrder).not.toHaveBeenCalled();
        });

        it('should call confirmation modal', function() {
            vm.items[0].$selected = true;
            vm.items[0].requisition.supplyingFacility = supplyingDepots[0];

            vm.convertToOrder();
            confirmDeferred.resolve();
            convertDeferred.resolve();
            $rootScope.$apply();

            expect(confirmService.confirm)
                .toHaveBeenCalledWith('msg.question.confirmation.convertToOrder');
        });

        it('should bring up loading modal if confirmation passed', function() {
            vm.items[0].$selected = true;
            vm.items[0].requisition.supplyingFacility = supplyingDepots[0];

            vm.convertToOrder();
            confirmDeferred.resolve();
            convertDeferred.resolve();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call requisitionService if confirmation passed', function() {
            vm.items[0].$selected = true;
            vm.items[0].requisition.supplyingFacility = supplyingDepots[0];

            vm.convertToOrder();
            confirmDeferred.resolve();
            convertDeferred.resolve();
            $rootScope.$apply();

            expect(requisitionService.convertToOrder).toHaveBeenCalledWith([
                vm.items[0]
            ]);
        });

        it('should show alert if convert passed', function() {
            vm.items[0].$selected = true;
            vm.items[0].requisition.supplyingFacility = supplyingDepots[0];

            vm.convertToOrder();
            confirmDeferred.resolve();
            convertDeferred.resolve();
            $rootScope.$apply();
            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith('msg.rnr.converted.to.order');
        });

        it('should show error if convert failed', function() {
            vm.items[0].$selected = true;
            vm.items[0].requisition.supplyingFacility = supplyingDepots[0];

            vm.convertToOrder();
            confirmDeferred.resolve();
            convertDeferred.reject();
            $rootScope.$apply();

            expect(notificationService.error).toHaveBeenCalledWith('msg.error.occurred');
        });

        it('should close loading modal if convert failed', function() {
            vm.items[0].$selected = true;
            vm.items[0].requisition.supplyingFacility = supplyingDepots[0];

            vm.convertToOrder();
            confirmDeferred.resolve();
            convertDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

    });

    it('should show error when trying to convert to order with no supplying depot selected', function() {
        vm.items[0].$selected = true;

        spyOn(requisitionService, 'convertToOrder').andReturn($q.when());
        spyOn(notificationService, 'error').andCallThrough();

        vm.convertToOrder();

        expect(requisitionService.convertToOrder).not.toHaveBeenCalled();
        expect(notificationService.error).toHaveBeenCalledWith('msg.noSupplyingDepotSelected');
    });

    it('should show error when trying to convert to order with no requisition selected', function() {
        spyOn(requisitionService, 'convertToOrder').andReturn($q.when());
        spyOn(notificationService, 'error').andCallThrough();

        vm.convertToOrder();

        expect(requisitionService.convertToOrder).not.toHaveBeenCalled();
        expect(notificationService.error).toHaveBeenCalledWith('msg.select.at.least.one.rnr');
    });

    it('should select all requisitions', function() {
       vm.toggleSelectAll(true);

       expect(vm.items[0].$selected).toBe(true);
       expect(vm.items[1].$selected).toBe(true);
    });

    it('should deselect all requisitions', function() {
        vm.toggleSelectAll(false);

        expect(vm.items[0].$selected).toBe(false);
        expect(vm.items[1].$selected).toBe(false);
    });

    it('should set "select all" option when all requisitions are selected by user', function() {
       vm.items[0].$selected = true;
       vm.items[1].$selected = true;

       vm.setSelectAll();

       expect(vm.selectAll).toBe(true);
    });

    it('should not set "select all" option when not all requisitions are selected by user', function() {
        vm.items[0].$selected = true;
        vm.items[1].$selected = false;

        vm.setSelectAll();

        expect(vm.selectAll).toBe(false);
    });

    describe('search', function() {

        beforeEach(function() {
            spyOn($state, 'go').andReturn();
        });

        it('should expose search method', function() {
            expect(angular.isFunction(vm.search)).toBe(true);
        });

        it('should call state go method', function() {
            vm.search();
            expect($state.go).toHaveBeenCalled();
        });

        it('should call state go method with changed params', function() {
            vm.filterBy = 'filterBy';
			vm.filterValue = 'filterValue';
			vm.sortBy = 'sortBy';
			vm.descending = true;

            vm.search();

            expect($state.go).toHaveBeenCalledWith('requisitions.convertToOrder', {
                filterBy: 'filterBy',
                filterValue: 'filterValue',
                sortBy: 'sortBy',
                descending: true,
                page: 0,
                size: 10
            }, {reload: true});
        });
    });
});
