describe('ConvertToOrderCtrl', function(){

    var vm, rootScope, $state, $q, stateParams, requisitionService, notification, requisitions;

    beforeEach( function() {
        module('openlmis.requisitions');

        inject(function ($controller, $rootScope, _$state_, _$q_, _RequisitionService_, _Notification_) {
        rootScope = $rootScope;
        $state = _$state_;
        requisitionService = _RequisitionService_;
        notification = _Notification_;
        $q = _$q_;

        stateParams = {
            filterBy: 'all',
            filterValue: ''
        };
        requisitions = [
            {
                id: 'requisitionId1',
                facility: {
                    name: 'facility1',
                    code: 'code1'
                },
                program: {
                    name: 'program1'
                }
            },
            {
                id: 'requisitonId2',
                facility: {
                    name: 'facility2',
                    code: 'code2'
                },
                program: {
                    name: 'program2'
                }
            }
        ];

        vm = $controller('ConvertToOrderCtrl', {$stateParams: stateParams, requisitions: requisitions,
            RequisitionService: requisitionService, Notification: notification});
        });
    });

    it('should show all requisitions if default filter is applied', function () {
        expect(vm.searchParams.filterBy).toEqual('all');
        expect(vm.searchParams.filterValue).toEqual('');
        expect(vm.requisitions).toEqual(requisitions);
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
        spyOn(requisitionService, 'convertToOrder').andReturn($q.when());

        vm.convertToOrder();

        expect(requisitionService.convertToOrder).toHaveBeenCalled();
    });

    it('should show error when trying to convert to order with no requisition selected', function() {
        spyOn(requisitionService, 'convertToOrder').andReturn($q.when());
        spyOn(notification, 'error').andCallThrough();

        vm.convertToOrder();

        expect(requisitionService.convertToOrder).not.toHaveBeenCalled();
        expect(notification.error).toHaveBeenCalledWith('msg.select.at.least.one.rnr');
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
