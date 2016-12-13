/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('RequisitionSearchController', function() {

    var rootScope, httpBackend, endDate, startDate, notification, vm,
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
                        id: '3',
                        name: 'program3'
                    },
                    {
                        id: '4',
                        name: 'program4'
                    }
                ]
            }
        ],
        requisitionList = [{
            facility: {
                name: 'facility1',
                code: 'code1',
            },
            program: {
                name: 'program1'
            }
        }];

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function ($httpBackend, $rootScope, $controller, Status, RequisitionURL, Notification) {
        rootScope = $rootScope;
        httpBackend = $httpBackend;
        startDate = new Date();
        endDate = new Date();
        notification = Notification;

        vm = $controller('RequisitionSearchController', {facilityList:facilityList});
    }));

    beforeEach(inject(function(RequisitionService, $q){
        var response = $q.when(requisitionList);
        spyOn(RequisitionService, 'search').andReturn(response);
    }));

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
        spyOn(notification, 'error').andCallFake(callback);
        vm.search();
        expect(callback).toHaveBeenCalled();
    });

});
