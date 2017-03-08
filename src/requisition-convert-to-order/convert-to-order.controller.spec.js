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

    var vm, rootScope, state, q, $stateParams, requisitionService, notificationService,
        requisitions, supplyingDepots, stateParams;

    beforeEach( function() {
        module('requisition-convert-to-order');

        inject(function ($controller, $rootScope, _$state_, _$q_, _requisitionService_,
                         _notificationService_) {

            rootScope = $rootScope;
            state = _$state_;
            requisitionService = _requisitionService_;
            notificationService = _notificationService_;
            q = _$q_;

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

            vm = $controller('ConvertToOrderController', {
                totalItems: 2,
                items: requisitions,
                stateParams: stateParams,
                $stateParams: stateParams
            });
        });
    });

    it('should show all requisitions if default filter is applied', function() {
        expect(vm.stateParams.filterBy).toEqual('all');
        expect(vm.stateParams.filterValue).toEqual('');
        expect(vm.pageItems).toEqual(requisitions);
    });

    it('should get all selected requisitions', function() {
        vm.pageItems[0].$selected = true;

        var selectedRequisitions = vm.getSelected();

        expect(selectedRequisitions).toEqual([requisitions[0]]);
    });

    it('should get an empty array if no requisition is selected', function() {
        var selectedRequisitions = vm.getSelected();

        expect(selectedRequisitions).toEqual([]);
    });

    it('should convert to order selected requisitions', function() {
        vm.pageItems[0].$selected = true;
        vm.pageItems[0].requisition.supplyingFacility = {id: 'supplyingFacilityId'};

        spyOn(requisitionService, 'convertToOrder').andReturn(q.when());

        vm.convertToOrder();

        expect(requisitionService.convertToOrder).toHaveBeenCalled();
    });

    it('should show error when trying to convert to order with no supplying depot selected', function() {
        vm.pageItems[0].$selected = true;

        spyOn(requisitionService, 'convertToOrder').andReturn(q.when());
        spyOn(notificationService, 'error').andCallThrough();

        vm.convertToOrder();

        expect(requisitionService.convertToOrder).not.toHaveBeenCalled();
        expect(notificationService.error).toHaveBeenCalledWith('msg.noSupplyingDepotSelected');
    });

    it('should show error when trying to convert to order with no requisition selected', function() {
        spyOn(requisitionService, 'convertToOrder').andReturn(q.when());
        spyOn(notificationService, 'error').andCallThrough();

        vm.convertToOrder();

        expect(requisitionService.convertToOrder).not.toHaveBeenCalled();
        expect(notificationService.error).toHaveBeenCalledWith('msg.select.at.least.one.rnr');
    });

    it('should select all requisitions', function() {
       vm.toggleSelectAll(true);

       expect(vm.pageItems[0].$selected).toBe(true);
       expect(vm.pageItems[1].$selected).toBe(true);
    });

    it('should deselect all requisitions', function() {
        vm.toggleSelectAll(false);

        expect(vm.pageItems[0].$selected).toBe(false);
        expect(vm.pageItems[1].$selected).toBe(false);
    });

    it('should set "select all" option when all requisitions are selected by user', function() {
       vm.pageItems[0].$selected = true;
       vm.pageItems[1].$selected = true;

       vm.setSelectAll();

       expect(vm.selectAll).toBe(true);
    });

    it('should not set "select all" option when not all requisitions are selected by user', function() {
        vm.pageItems[0].$selected = true;
        vm.pageItems[1].$selected = false;

        vm.setSelectAll();

        expect(vm.selectAll).toBe(false);
    });
});
