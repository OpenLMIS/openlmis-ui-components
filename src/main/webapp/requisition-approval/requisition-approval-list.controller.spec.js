describe('RequisitionApprovalListController', function () {

    //injects
    var vm, $state;

    //variables
    var requisitionList;

    beforeEach(function() {
        module('requisition-approval');

        inject(function ($controller, _$state_) {

            $state = _$state_;
            requisitionList = [
                {
                    id: 1,
                    facility: {
                        name: 'first facility',
                        code: 'first code'
                    },
                    program: {
                        name: 'first program'
                    }
                },
                {
                    id: 2,
                    facility: {
                        name: 'second facility',
                        code: 'second code',
                    },
                    program: {
                        name: 'second program'
                    }
                }
            ];
            vm = $controller("RequisitionApprovalListController", {requisitionList:requisitionList});
        });
    });

    it('should call state go when opening requisition', function () {
        spyOn($state, 'go');
        vm.openRnr(requisitionList[0].id);
        expect($state.go).toHaveBeenCalledWith('requisitions.requisition.fullSupply', {rnr: requisitionList[0].id});
    });
});
