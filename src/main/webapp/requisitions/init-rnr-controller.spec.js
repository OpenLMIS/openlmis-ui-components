describe("InitiateRnrController", function(){

    var $q, scope, ctrl, $httpBackend, location, facilities, programs, rootScope,
    navigateBackService, periodFactory, $state, period;

    beforeEach(module('openlmis.requisitions'));
    beforeEach(inject(function (_$q_, $rootScope, $controller, _PeriodFactory_,
    _$state_, _RequisitionService_) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        periodFactory =_PeriodFactory_;
        $state = _$state_;
        requisitionService = _RequisitionService_;
        $q = _$q_;

        user = {"user_id": "user_id"};
        programs = [{item: {"code": "HIV", "id": 1}}];
        facility = {
            "id": "10134",
            "name": "National Warehouse",
            "description": null,
            "code": "CODE",
            "supportedPrograms": programs};

        
        initController = function() {
            return $controller('InitiateRnrController', {facility: facility, user: user, supervisedPrograms: [],
            PeriodFactory: periodFactory, RequisitionService: requisitionService});
        }

        period = [{"id": 1, "rnrId": 123, "startDate": "01-01-2016", "endDate": "02-02-2016"}];
        spyOn(periodFactory, 'get').andReturn($q.when(period));
    }));

    it("should assign proper values when facility is assigned", function() {
        var controller = initController();

        expect(controller.selectedFacilityId).toEqual(facility.id);
        expect(controller.programs).toEqual(programs);
        expect(controller.selectedProgram).toEqual(programs[0]);
    });

    it("Should change page to requisitions.requisition for with selected period with rnrId", function(){
        var controller = initController();
        var selectedPeriod = {"rnrId": 1};

        spyOn($state, 'go');

        controller.initRnr(selectedPeriod);

        expect($state.go).toHaveBeenCalledWith('requisitions.requisition.fullSupply', {"rnr":1});

    });

    it("Should change page to requisitions.requisition for newly initialized requisition in selected period",
    function(){
        var selectedPeriod = {"id":1};

        spyOn($state, 'go');
        spyOn(requisitionService, 'initiate').andReturn($q.when({"id": 1}));

        var controller = initController();

        controller.initRnr(selectedPeriod);
        scope.$apply();

        expect($state.go).toHaveBeenCalledWith('requisitions.requisition.fullSupply', {"rnr": 1});
    });

    it("Should not change page to requisitions.requisition with selected period without rnrId "
    + "and when invalid response from service",
    function(){
        spyOn(requisitionService,'initiate').andReturn($q.reject({"id": 1}));

        var selectedPeriod = {};

        spyOn($state, 'go');

        var controller = initController();

        controller.initRnr(selectedPeriod);
        scope.$apply();

        expect($state.go).not.toHaveBeenCalled();
    });

    it("Should reload periods with proper data", function() {

        var controller = initController();
        controller.loadPeriods();
        scope.$apply();

        expect(periodFactory.get).toHaveBeenCalled();
        expect(controller.periodGridData).toEqual(period);
    });
});
