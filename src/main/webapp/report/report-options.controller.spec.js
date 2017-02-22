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

describe('ReportOptionsController', function() {

    //tested
    var vm;

    //mocks
    var report, reportUrlFactoryMock;

    //injects
    var state, rootScope;

    beforeEach(function() {
        module('report');

        module(function($provide) {

            reportUrlFactoryMock = jasmine.createSpy();

            $provide.factory('reportUrlFactory', function() {
                return reportUrlFactoryMock;
            });
        });

        report = {
            id: 'id-one',
            name: 'Report 1',
            templateParameters: [
                {
                    name: 'param1',
                    displayName: 'Param 1',
                    selectExpression: '/api/programs'
                },
                {
                    name: 'param2',
                    displayName: 'Param 2',
                    selectExpression: '/api/facilities'
                },
            ]
        };

        inject(function($controller, $state, $rootScope, requisitionReportService, $q) {
            state = $state;
            rootScope = $rootScope;

            spyOn(requisitionReportService, 'getParameterOptions').andReturn($q.when([]));
            vm = $controller('ReportOptionsController', {
                report: report
            });
        });

        reportUrlFactoryMock.andCallFake(function(url, report, selectedValues, format) {
            return '/requisitions/' + report.id + '/' + format;
        });
    });

    it('should set report and initialize selected values', function() {
        expect(vm.report).toEqual(report);
        expect(vm.selectedValues).toEqual({});
    });

    it('getReportUrl should prepare URLs correctly', function() {
        expect(vm.getReportUrl('pdf')).toEqual('/requisitions/id-one/pdf');
        expect(vm.getReportUrl('csv')).toEqual('/requisitions/id-one/csv');
        expect(vm.getReportUrl('xls')).toEqual('/requisitions/id-one/xls');
        expect(vm.getReportUrl('html')).toEqual('/requisitions/id-one/html');
    });
});
