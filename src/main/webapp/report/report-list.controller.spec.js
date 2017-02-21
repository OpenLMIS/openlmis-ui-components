/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('ReportListController', function() {

    //tested
    var vm;

    //mocks
    var reports;

    //injects
    var state, rootScope;

    beforeEach(function() {
        module('report');

        reports = [
            {
                id: 'id-one',
                name: 'Report 1'
            },
            {
                id: 'id-two',
                name: 'Report 2'
            }
        ];

        inject(function($controller, $state, $rootScope) {

            state = $state;
            rootScope = $rootScope;

            vm = $controller('ReportListController', {
                reports: reports
            });
        });
    });

    it('should set report list', function() {
        expect(vm.reports).toEqual(reports);
    });

    it('should go to report options page', function() {
        var stateGoSpy = jasmine.createSpy();

        spyOn(state, 'go').andCallFake(stateGoSpy);

        vm.goToReport(reports[0].id);

        rootScope.$apply();

        expect(stateGoSpy).toHaveBeenCalledWith('reports.options', { report: reports[0].id });
    });
});
