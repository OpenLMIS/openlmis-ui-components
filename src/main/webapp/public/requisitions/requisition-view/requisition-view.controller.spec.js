/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

ddescribe('RequisitionViewController', function() {

    var scope, ctrl, httpBackend, controller, statuses, endDate, startDate
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

    beforeEach(inject(function ($httpBackend, $rootScope, $controller, Status, RequisitionURL) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        statuses = Status.$toList();
        startDate = new Date();
        endDate = new Date();

        // httpBackend.when('GET', RequisitionURL('/api/requisitions/search?endDate=' + endDate.toISOString() + '&facility=' + facilityList[0].id + 
        //     '&program=' + facilityList[0].supportedPrograms[0].id + '&startDate=' + startDate.toISOString() + 
        //     '&status%5B%5D=' + statuses[1].label + '&status%5B%5D=' + statuses[2].label))
        // .respond(200, requisitionList);
        ctrl = controller('RequisitionViewController', {$scope:scope, facilityList:facilityList});
    }));

    beforeEach(inject(function(RequisitionService, $q){
        var response = $q.when(requisitionList);
        spyOn(RequisitionService, 'search').andReturn(response);
    }));

    it('should have facility list and status list filled after init', function() {
        expect(scope.facilities).toEqual(facilityList);
        expect(scope.statuses).toEqual(statuses)
    });

    it('should fill programs after changing selected facility', function() {
        expect(scope.selectedFacility).toBe(undefined);
        expect(scope.programs).toBe(undefined);

        scope.selectedFacility = scope.facilities[0];
        scope.loadPrograms();
        expect(scope.selectedFacility.id).toEqual('1');
        expect(scope.programs).toEqual(scope.facilities[0].supportedPrograms);

        scope.selectedFacility = scope.facilities[1];
        scope.loadPrograms();
        expect(scope.selectedFacility.id).toEqual('2');
        expect(scope.programs).toEqual(scope.facilities[1].supportedPrograms);
    });

    it('should load grid data after search', function() {
        scope.selectedFacility = scope.facilities[0];
        scope.selectedProgram = scope.selectedFacility.supportedPrograms[0];
        scope.selectedStatuses = [
            {
                id: 1
            }, {
                id: 2
            }
        ];
        scope.startDate = startDate;
        scope.endDate = endDate;

        scope.search();
        // search has a promise, finish the promise
        scope.$apply();

        expect(angular.toJson(scope.requisitionList)).toEqual(angular.toJson(requisitionList));
    });

    it('search is disabled if facility is not selected', function() {
        expect(scope.selectedFacility).toBe(undefined);
        scope.search();
        expect(scope.error).toBe('msg.no.facility.selected');
    });

});

