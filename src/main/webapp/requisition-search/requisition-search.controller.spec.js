describe('RequisitionSearchController', function() {

    var rootScope, httpBackend, endDate, startDate, notificationService, vm, facilityList, requisitionList, offlineRequisitions;

    beforeEach(function() {
        module('requisition-search', function($provide) {
            offlineRequisitions = jasmine.createSpyObj('offlineRequisitions', ['removeBy']);
            $provide.factory('localStorageFactory', function() {
                return function() {
                    return offlineRequisitions;
                };
            });
        });

        facilityList = [
            {
                id: '1',
                name: 'facility1',
                supportedPrograms: [
                    {
                        id: '1',
                        name: 'program1'
                    },
                    {
                        id: '2',
                        name: 'program2'
                    }
                ]

            },
            {
                id: '2',
                name: 'facility2',
                supportedPrograms: [
                    {
                        name: 'program3',
                        id: '3'
                    },
                    {
                        id: '4',
                        name: 'program4'
                    }
                ]
            }
        ];
        requisitionList = [{
            facility: {
                name: 'facility1',
                code: 'code1',
            },
            program: {
                name: 'program1'
            }
        }];

        inject(function ($httpBackend, $rootScope, $controller, requisitionUrlFactory,
                         _notificationService_, requisitionService, $q) {

            var response = $q.when(requisitionList);
            spyOn(requisitionService, 'search').andReturn(response);

            rootScope = $rootScope;
            httpBackend = $httpBackend;
            startDate = new Date();
            endDate = new Date();
            notificationService = _notificationService_;

            vm = $controller('RequisitionSearchController', {facilityList:facilityList});
        });
    });

    it('should fill programs after changing selected facility', function() {
        expect(vm.selectedFacility).toBe(undefined);
        expect(vm.programs).toBe(undefined);

        vm.selectedFacility = vm.facilities[0];
        vm.loadPrograms();
        expect(vm.selectedFacility.id).toEqual('1');
        expect(vm.programs).toEqual(vm.facilities[0].supportedPrograms);

        vm.selectedFacility = vm.facilities[1];
        vm.loadPrograms();
        expect(vm.selectedFacility.id).toEqual('2');
        expect(vm.programs).toEqual(vm.facilities[1].supportedPrograms);
    });

    it('should load requisitions after search', function() {
        vm.selectedFacility = vm.facilities[0];
        vm.selectedProgram = vm.selectedFacility.supportedPrograms[0];
        vm.startDate = startDate;
        vm.endDate = endDate;

        vm.search();

        rootScope.$apply();

        expect(angular.toJson(vm.requisitionList)).toEqual(angular.toJson(requisitionList));
    });

    it('search should give an error if facility is not selected', function() {
        var callback = jasmine.createSpy();
        expect(vm.selectedFacility).toBe(undefined);
        spyOn(notificationService, 'error').andCallFake(callback);
        vm.search();
        expect(callback).toHaveBeenCalled();
    });

    describe('removeOfflineRequisition', function() {

        var requisition = {
            id: '1',
            $availableOffline: true
        };

        beforeEach(function() {
            vm.removeOfflineRequisition(requisition);
        });

        it('should remove requisition from local storage', function() {
            expect(offlineRequisitions.removeBy).toHaveBeenCalledWith('id', requisition.id);
        });

        it('should mark requisition as not available offline', function() {
            expect(requisition.$availableOffline).toBe(false);
        });
    });
});
