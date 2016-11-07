ddescribe('ConvertToOrderController', function() {
   
    var $q, $scope, $rootScope, $controller, RequisitionService;

    var emptyList = [];

    var requisitionList = [{
        requisition: {
            name: 'requisitionOne'
        },
        supplyingDepots: []
    }, {
        requisition: {
            name: 'requisitionTwo'
        },
        supplyingDepots: []
    }];

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(_$q_, _$rootScope_, _$controller_, _RequisitionService_) {
        $q = _$q_
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        RequisitionService = _RequisitionService_;
    }));

    it('init should set requisitions', function() {
        spyOn(RequisitionService, 'forConvert')
            .andReturn($q.when(requisitionList));

        initConvertToOrderCtrl();
        expect($scope.filteredRequisitions).toBe(requisitionList);
    });

    describe('reloadGrid', function() {

        it('should set requisitions', function() {
            spyOn(RequisitionService, 'forConvert')
                .andReturn($q.when(requisitionList));

            initConvertToOrderCtrl();
            $scope.searchParams.filterBy = 'program';
            $scope.searchParams.filterValue = 'name';
            $scope.reloadGrid();
            $rootScope.$apply();

            expect($scope.filteredRequisitions).toBe(requisitionList);
        });

        it('should set nothingToConvert to true if search params are default and requisition list is empty', function() {
            spyOn(RequisitionService, 'forConvert')
                .andReturn($q.when(emptyList));

            initConvertToOrderCtrl();
            $scope.reloadGrid();
            $rootScope.$apply();

            expect($scope.nothingToConvert).toBe(true);
        });

        it('should set nothingToConvert to false if search params are not default', function() {
            spyOn(RequisitionService, 'forConvert')
                .andReturn($q.when(emptyList));

            initConvertToOrderCtrl();
            $scope.searchParams.filterBy = 'program';
            $scope.reloadGrid();
            $rootScope.$apply();

            expect($scope.nothingToConvert).toBe(false);
        });

        it('should set nothingToConvert to false if requisition list is not empty', function() {
            spyOn(RequisitionService, 'forConvert')
                .andReturn($q.when(requisitionList));

            initConvertToOrderCtrl();
            $scope.searchParams.filterBy = 'program';
            $scope.reloadGrid();
            $rootScope.$apply();

            expect($scope.nothingToConvert).toBe(false);
        });

    });

    describe('getInfoMessage', function() {

        beforeEach(function() {
            spyOn(RequisitionService, 'forConvert')
                .andReturn($q.when(requisitionList));
            initConvertToOrderCtrl();
        });

        it('should return undefined if requisition list is not empty', function() {
            $scope.nothingToConvert = false;
            $scope.filteredRequisitions = requisitionList;

            expect($scope.getInfoMessage()).toBeUndefined();
        });

        it('should return "message.no.requisitions.for.conversion" there is nothing to convert', function() {
            $scope.nothingToConvert = true;

            expect($scope.getInfoMessage()).toBe('message.no.requisitions.for.conversion');
        });

        it('should return "message.no.search.results" if there is something to convert but requisition list is empty', function() {
            $scope.nothingToConvert = false;
            $scope.filteredRequisitions = emptyList;

            expect($scope.getInfoMessage()).toBe('message.no.search.results');
        })

        it('should return undefined if requisition list is undefined', function() {
            $scope.filteredRequisitions = undefined;

            expect($scope.getInfoMessage()).toBeUndefined();
        })

    });

    it('convertToOrder should only send selected requistions', function() {
        spyOn(RequisitionService, 'forConvert')
            .andReturn($q.when(requisitionList));
        spyOn(RequisitionService, 'convertToOrder')
            .andReturn($q.when({}));

        var selectedRows = [];
        selectedRows.push(requisitionList[1]);

        initConvertToOrderCtrl();
        $scope.gridApi = {
            selection: {
                getSelectedRows: function() {
                    return selectedRows;
                }
            }
        }
        $scope.convertToOrder();

        expect(RequisitionService.convertToOrder)
            .toHaveBeenCalledWith(selectedRows);
    });

    function initConvertToOrderCtrl() {
        $controller('ConvertToOrderCtrl', {
            $scope: $scope
        });
        $rootScope.$apply();
    }

});