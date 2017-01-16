describe('ConvertToOrderController', function(){

    var vm, rootScope, state, q, stateParams, requisitionService, notificationService,
        requisitions, supplyingDepots;

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
            filterValue: ''
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

        vm = $controller('ConvertToOrderController', {$stateParams: stateParams, requisitions: requisitions});
        });
    });

    it('should show all requisitions if default filter is applied', function() {
        expect(vm.searchParams.filterBy).toEqual('all');
        expect(vm.searchParams.filterValue).toEqual('');
        expect(vm.requisitions).toEqual(requisitions);
    });

    it('should reload state with proper params to filter requisitions by facility code', function() {
        vm.searchParams.filterBy = 'facilityCode';
        vm.searchParams.filterValue = 'code1';
        state.current = {name: 'requisitions.convertToOrder'};
        spyOn(state, 'go').andCallThrough();

        vm.reload();

        expect(state.go).toHaveBeenCalledWith('requisitions.convertToOrder', vm.searchParams, {reload: true});
    });

    it('should reload state with proper params to filter requisitions by facility name', function() {
        vm.searchParams.filterBy = 'facilityName';
        vm.searchParams.filterValue = 'facility1';
        state.current = {name: 'requisitions.convertToOrder'};
        spyOn(state, 'go').andCallThrough();

        vm.reload();

        expect(state.go).toHaveBeenCalledWith('requisitions.convertToOrder', vm.searchParams, {reload: true});
    });

    it('should reload state with proper params to filter requisitions by program name', function() {
        vm.searchParams.filterBy = 'programName';
        vm.searchParams.filterValue = 'program1';
        state.current = {name: 'requisitions.convertToOrder'};
        spyOn(state, 'go').andCallThrough();

        vm.reload();

        expect(state.go).toHaveBeenCalledWith('requisitions.convertToOrder', vm.searchParams, {reload: true});
    });

    it('should get all selected requisitions', function() {
        vm.requisitions[0].$selected = true;

        var selectedRequisitions = vm.getSelected();

        expect(selectedRequisitions).toEqual([requisitions[0]]);
    });

    it('should get an empty array if no requisition is selected', function() {
        var selectedRequisitions = vm.getSelected();

        expect(selectedRequisitions).toEqual([]);
    });

    it('should convert to order selected requisitions', function() {
        vm.requisitions[0].$selected = true;
        vm.requisitions[0].requisition.supplyingFacility = {id: 'supplyingFacilityId'};

        spyOn(requisitionService, 'convertToOrder').andReturn(q.when());

        vm.convertToOrder();

        expect(requisitionService.convertToOrder).toHaveBeenCalled();
    });

    it('should show error when trying to convert to order with no supplying depot selected', function() {
        vm.requisitions[0].$selected = true;

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

       expect(vm.requisitions[0].$selected).toBe(true);
       expect(vm.requisitions[1].$selected).toBe(true);
    });

    it('should deselect all requisitions', function() {
        vm.toggleSelectAll(false);

        expect(vm.requisitions[0].$selected).toBe(false);
        expect(vm.requisitions[1].$selected).toBe(false);
    });

    it('should set "select all" option when all requisitions are selected by user', function() {
       vm.requisitions[0].$selected = true;
       vm.requisitions[1].$selected = true;

       vm.setSelectAll();

       expect(vm.selectAll).toBe(true);
    });

    it('should not set "select all" option when not all requisitions are selected by user', function() {
        vm.requisitions[0].$selected = true;
        vm.requisitions[1].$selected = false;

        vm.setSelectAll();

        expect(vm.selectAll).toBe(false);
    });
});
