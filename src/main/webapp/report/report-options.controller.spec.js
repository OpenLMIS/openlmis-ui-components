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
    var report;

    //injects
    var state, rootScope, openlmisUrlFactoryMock;

    beforeEach(function() {
        module('report');

        module(function($provide) {

            openlmisUrlFactoryMock = jasmine.createSpy();

            $provide.factory('openlmisUrlFactory', function() {
                return openlmisUrlFactoryMock;
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

            spyOn(requisitionReportService, 'getParameterValues').andReturn($q.when([]));
            vm = $controller('ReportOptionsController', {
                report: report
            });
        });

        openlmisUrlFactoryMock.andCallFake(function(url) {
            return 'http://some.url' + url;
        });
    });

    it('should set report and initialize selected values', function() {
        expect(vm.report).toEqual(report);
        expect(vm.selectedValues).toEqual({});
    });

    it('getReportUrl should prepare URLs correctly', function() {
        vm.selectedValues = {
            param1: 'Option 1',
            param2: 'Value 1'
        }
        expect(vm.getReportUrl('pdf')).toEqual('http://some.url/api/reports/templates/requisitions/id-one/pdf?param1=Option 1&&param2=Value 1&&');
        expect(vm.getReportUrl('csv')).toEqual('http://some.url/api/reports/templates/requisitions/id-one/csv?param1=Option 1&&param2=Value 1&&');
        expect(vm.getReportUrl('xls')).toEqual('http://some.url/api/reports/templates/requisitions/id-one/xls?param1=Option 1&&param2=Value 1&&');
        expect(vm.getReportUrl('html')).toEqual('http://some.url/api/reports/templates/requisitions/id-one/html?param1=Option 1&&param2=Value 1&&');
    });
});
