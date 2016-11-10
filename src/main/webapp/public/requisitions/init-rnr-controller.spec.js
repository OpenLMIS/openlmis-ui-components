describe("InitiateRnrController", function(){

    var $q, scope, ctrl, $httpBackend, location, facilities, programs, rootScope,
    navigateBackService, periodFactory, $state;

    beforeEach(module('openlmis.requisitions'));
    beforeEach(inject(function (_$q_, $rootScope, $controller, _PeriodFactory_,
    _$state_, _RequisitionService_) {
        scope = $rootScope.$new();
        rootScope = $rootScope;

        periodFactory =_PeriodFactory_;
        $state = _$state_;
        requisitionService = _RequisitionService_;
        $q = _$q_;


        programs = [
           {item: {"code": "HIV", "id": 1}}
        ];
        facilities=
          {"id": "10134", "name": "National Warehouse", "description": null, "code": "CODE",
          "supportedPrograms": programs}
        ;
        initController = function(){
            return $controller('InitiateRnrController', {$scope: scope, facility: facilities,
            PeriodFactory: periodFactory, RequisitionService: requisitionService});
        }

    }));

    it("should reload periods when program changes", function(){


        var period = {"id": 1, "rnrId": 123, "startDate": "01-01-2016", "endDate": "02-02-2016"};
        spyOn(periodFactory, 'get').andReturn($q.when(period));

        var controller = initController();
        spyOn(scope, 'loadPeriods');

        scope.selectedProgram.item = {"code": "Code", "id": 1};
        scope.$apply();

        expect(scope.loadPeriods).toHaveBeenCalled();
    });

    it("should reload periods when type changes", function() {

        var period = {"id":1, "rnrId":123,  "startDate": "01-01-2016", "endDate": "02-02-2016"};

        spyOn(periodFactory, 'get').andReturn($q.when(period));
        var controller = initController();
        spyOn(scope, 'loadPeriods');

        scope.emergency = {"name": "name", "emergency":false};
        scope.$apply();

        expect(scope.loadPeriods).toHaveBeenCalled();
    });

    it("should assigns proper values when facility is assigned", function() {
        var controller = initController();

        expect(scope.facilityDisplayName).toEqual(facilities.code + '-' + facilities.name);
        expect(scope.selectedFacilityId).toEqual(facilities.id);
        expect(scope.programs).toEqual(programs);
        expect(scope.selectedProgram).toEqual(programs[0]);
    });

    it("Should change page with selected period with rnrId", function(){
        var controller = initController();
        var selectedPeriod = {"rnrId": 1};

        spyOn($state, 'go');

        scope.initRnr(selectedPeriod);

        expect($state.go).toHaveBeenCalled();

    });

    it("Should change page with selected period without rnrId", function(){
        var selectedPeriod = {"id":1};
        var period = {"id":1, "rnrId":123,  "startDate": "01-01-2016", "endDate": "02-02-2016"};


        spyOn($state, 'go');

        spyOn(requisitionService, 'initiate').andReturn($q.when([{"id": 1}]));
        spyOn(periodFactory, 'get').andReturn($q.when(period));

        var controller = initController();

        scope.initRnr(selectedPeriod);

        scope.$apply();

        expect($state.go).toHaveBeenCalled();
    });

    it("Should not change page with selected period without rnrId and when invalid response from service",
    function(){
    var period = {"id":1, "rnrId":123,  "startDate": "01-01-2016", "endDate": "02-02-2016"};
        requisitionService = { initiate: function(){
            var deferred = $q.defer();
            deferred.reject([{"id": 1}]);
            return deferred.promise;
        }
        };
        var selectedPeriod = {};

        spyOn($state, 'go');
        spyOn(periodFactory, 'get').andReturn($q.when(period));

         var controller = initController();

        scope.initRnr(selectedPeriod);

        scope.$apply();

        expect($state.go).not.toHaveBeenCalled();
    });

    it("Should reload periods with proper data", function() {
        var period = {"id": 1, "rnrId": 123, "startDate": "march", "endDate": "may"};
        var requisition = [{"id": 2,"processingPeriod":period, "programId":1, "facilityId":10134}];

        spyOn(periodFactory, 'get').andReturn($q.when(period));

        var controller = initController();
        scope.loadPeriods();
        scope.$apply();

        expect(periodFactory.get).toHaveBeenCalled();
        expect(scope.periodGridData).toEqual(period);
    });
});