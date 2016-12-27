/*
* This program is part of the OpenLMIS logistics management information system platform software.
* Copyright © 2013 VillageReach
*
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
*  
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
*/

describe('RequistitionApprovalCtrl', function () {

    //injects
    var vm;

    //variables
    var requisitionList;

    beforeEach(function() {
        module('requisition-approval');

        inject(function ($controller) {

            requisitionList = [
                {
                    facility: {
                        name: 'first facility',
                        code: 'first code'
                    },
                    program: {
                        name: 'first program'
                    }
                },
                {
                    facility: {
                        name: 'second facility',
                        code: 'second code',
                    },
                    program: {
                        name: 'second program'
                    }
                }
            ];
            vm = $controller("RequistitionApprovalCtrl", {requisitionList:requisitionList});
        });
    });

    it('should show all requisitions if filter is not applied', function () {
        expect(vm.filteredRequisitions).toEqual(requisitionList);
        expect(vm.query).toBeUndefined();
        expect(vm.searchField).toBeUndefined();
    });


    it('should Filter requisitions against program name', function () {
        vm.query = "first";
        vm.searchField = {item: {name: "name", value: "program.name"}};

        vm.filterRequisitions();

        expect(vm.filteredRequisitions.length).toEqual(1);
        expect(vm.filteredRequisitions[0]).toEqual(requisitionList[0]);
    });

    it('should Filter requisitions against facility name', function () {
        vm.query = "second facility";
        vm.searchField = {item: {name: "name", value: "facility.name"}};
        vm.filterRequisitions();

        expect(vm.filteredRequisitions.length).toEqual(1);
        expect(vm.filteredRequisitions[0]).toEqual(requisitionList[1]);
    });

    it('should Filter requisitions against facility code', function () {
        vm.query = "second CO";
        vm.searchField = {item: {name: "name", value: "facility.code"}};
        vm.filterRequisitions();

        expect(vm.filteredRequisitions.length).toEqual(1);
        expect(vm.filteredRequisitions[0]).toEqual(requisitionList[1]);
    });

    it('should be able to Filter requisitions against all fields also', function() {
        vm.query = "second";
        vm.searchField = {item: {name: "name", value: ""}};

        vm.filterRequisitions();

        expect(vm.filteredRequisitions.length).toEqual(1);
        expect(vm.filteredRequisitions[0]).toEqual(requisitionList[1]);
    });

    it('should be able to case-insensitively Filter requisitions', function() {
        vm.query = "seCOnD";
        vm.searchField = {item: {name: "name", value: ""}};

        vm.filterRequisitions();

        expect(vm.filteredRequisitions.length).toEqual(1);
        expect(vm.filteredRequisitions[0]).toEqual(requisitionList[1]);
    });
});
