describe("RequisitionInitiateCtrl", function(){

    var $q, programs, rootScope, requisitionService, authorizationService, supervisedFacilities,
        periodFactory, $state, period, facility;

    beforeEach(module('requisition-initiate'));
    beforeEach(inject(function (_$q_, $rootScope, $controller, _PeriodFactory_,
    _$state_, _RequisitionService_, _authorizationService_, _SupervisedFacilities_) {

        rootScope = $rootScope;
        periodFactory =_PeriodFactory_;
        $state = _$state_;
        requisitionService = _RequisitionService_;
        authorizationService = _authorizationService_;
        supervisedFacilities = _SupervisedFacilities_;
        $q = _$q_;

        user = {"user_id": "user_id"};
        right = {"id": "right_id"};
        programs = [{"code": "HIV", "id": 1}, {"code": "programCode", "id": 2}];
        period = [{"id": 1, "rnrId": 123, "startDate": "01-01-2016", "endDate": "02-02-2016"}];
        facility = {
            "id": "10134",
            "name": "National Warehouse",
            "description": null,
            "code": "CODE",
            "supportedPrograms": programs
        };

        spyOn(periodFactory, 'get').andReturn($q.when(period));

        vm = $controller('RequisitionInitiateCtrl', {facility: facility, user: user, supervisedPrograms: programs,
            homePrograms: programs, PeriodFactory: periodFactory, RequisitionService: requisitionService});
    }));

    it("should assign proper values when facility is assigned", function() {
        expect(vm.selectedFacilityId).toEqual(facility.id);
        expect(vm.programs).toEqual(programs);
        expect(vm.selectedProgramId).toEqual(undefined);
    });

    it("Should change page to requisitions.requisition for with selected period with rnrId", function(){
        var selectedPeriod = {"rnrId": 1};
        spyOn($state, 'go');

        vm.initRnr(selectedPeriod);

        expect($state.go).toHaveBeenCalledWith('requisitions.requisition.fullSupply', {"rnr":1});

    });

    it("Should change page to requisitions.requisition for newly initialized requisition in selected period",
    function(){
        var selectedPeriod = {"id":1};
        spyOn($state, 'go');
        spyOn(requisitionService, 'initiate').andReturn($q.when({"id": 1}));

        vm.initRnr(selectedPeriod);
        rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('requisitions.requisition.fullSupply', {"rnr": 1});
    });

    it("Should not change page to requisitions.requisition with selected period without rnrId "
    + "and when invalid response from service",
    function(){
        var selectedPeriod = {};
        spyOn(requisitionService,'initiate').andReturn($q.reject({"id": 1}));
        spyOn($state, 'go');

        vm.initRnr(selectedPeriod);
        rootScope.$apply();

        expect($state.go).not.toHaveBeenCalled();
    });

    it("Should reload periods with proper data", function() {
        vm.selectedProgramId = programs[0].id;
        vm.selectedFacilityId = facility.id;

        vm.loadPeriods();
        rootScope.$apply();

        expect(periodFactory.get).toHaveBeenCalled();
        expect(vm.periodGridData).toEqual(period);
    });

    it("should load proper data for supervised facility", function() {
        vm.updateFacilityType(true);

        expect(vm.facilities).toEqual([]);
        expect(vm.programs).toEqual(vm.supervisedPrograms);
        expect(vm.selectedFacilityId).toEqual(undefined);
    });

    it("should load proper data for home facility", function() {
        vm.updateFacilityType(false);

        expect(vm.facilities).toEqual([facility]);
        expect(vm.programs).toEqual(vm.homePrograms);
        expect(vm.selectedFacilityId).toEqual(facility.id);
    });

    it("should load list of facilities for selected program", function() {
        var spyObj = {};
        spyObj.spyMethod = supervisedFacilities;
        spyOn(spyObj, 'spyMethod').andReturn([facility]);
        spyOn(authorizationService, 'getRightByName').andReturn(right);

        vm.loadFacilitiesForProgram(vm.supervisedPrograms[0]);

        expect(vm.facilities).toEqual([facility]);
    });

    it("should return empty list of facilities for undefined program", function() {
        vm.loadFacilitiesForProgram(undefined);

        expect(vm.facilities).toEqual([]);
    });

});
