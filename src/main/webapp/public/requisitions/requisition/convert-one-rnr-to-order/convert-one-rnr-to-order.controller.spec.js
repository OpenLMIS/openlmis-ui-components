describe('ConvertOneRnrToOrderCtrl', function() {

    var vm, scope, state, q, RequisitionService;

    var requisition = {
        id: '1',
        name: 'requisition',
        status: 'INITIATED',
        supplyingFacility: supplyingDepotSpy(0),
    };

    beforeEach(module('openlmis.requisitions'));

    beforeEach(module(function($provide) {
        RequisitionService = jasmine.createSpyObj('RequisitionService', ['convertToOrder']);

        RequisitionService.convertToOrder.andCallFake(function() {
            return q.when(true);
        });

    	$provide.service('RequisitionService', function(){
    		return RequisitionService;
    	});
    }));

    beforeEach(inject(function($rootScope, $state, $q) {
        scope = $rootScope.$new();
        state = $state;
        q = $q;
        scope.requisition = requisition,
        scope.requisitions = [{
            requisition: requisition,
            supplyingDepots: [
                supplyingDepotSpy(0),
                supplyingDepotSpy(1),
                supplyingDepotSpy(2),
                supplyingDepotSpy(3)
            ]
        }];
    }));

    beforeEach(inject(function($controller) {
        vm = $controller('ConvertOneRnrToOrderCtrl', {
            $scope: scope,
            $state: state,
            RequisitionService: RequisitionService
        });
    }));

    function supplyingDepotSpy(id) {
        return {
            $id: id
        };
    }

    it('should convert requisition', function() {
        var reload = jasmine.createSpy();
        spyOn(state, 'reload').andCallFake(reload);

        vm.convertRnr();
        scope.$apply();

        expect(RequisitionService.convertToOrder).toHaveBeenCalled();
        expect(reload).toHaveBeenCalled();

    });

    it('should bind requisition property to vm', function() {
        expect(vm.requisition).toBe(scope.requisition);
    });

    it('should bind requisitions property to vm', function() {
        expect(vm.requisitions).toBe(scope.requisitions);
    });
});
