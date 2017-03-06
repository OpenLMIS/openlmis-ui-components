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

describe('reportFactory', function() {

    var $rootScope, $q, reportServiceMock, reportFactory,
        report, report2, paramPeriod, paramFacility, periodOptions, facilityOptions,
        REPORT_ID = '629bc86c-0291-11e7-86e3-3417eb83144e',
        REPORT_ID2 = '6b207f14-0291-11e7-b732-3417eb83144e',
        REQUISITIONS = 'requisitions',
        PERIODS_URL = '/api/periods',
        FACILITIES_URL = '/api/facilities';

    beforeEach(function() {
        module('report', function($provide) {
            reportServiceMock = jasmine.createSpyObj('reportService',
                ['getReport', 'getReports', 'getReportParamsOptions']);
            $provide.service('reportService', function() {
                return reportServiceMock;
            });
        });

        inject(function(_$rootScope_, _$q_, _reportFactory_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            reportFactory = _reportFactory_;
        });

        paramPeriod = {
            name: 'periods',
            selectExpression: '/api/periods',
            selectProperty: 'name'
        };
        paramFacility = {
            name: 'facilities',
            selectExpression: '/api/facilities',
            selectProperty: 'code',
            displayProperty: 'name'
        };
        periodOptions = [
            { name: 'Q1' },
            { name: 'Q2' },
            { name: 'Q3' }
        ];
        facilityOptions = [
            { code: "F01", name: "Facility 1" },
            { code: "F02", name: "Facility 2" }
        ];
        report = {
            id: REPORT_ID,
            templateParameters: [paramPeriod, paramFacility]
        };
        report2 = { id: REPORT_ID2 };

        reportServiceMock.getReport.andCallFake(function(module, id) {
            if (module === REQUISITIONS) {
                if (id === REPORT_ID) {
                    return $q.when(report);
                }
                if (id === REPORT_ID2) {
                    return $q.when(report2);
                }
            }
        });

        reportServiceMock.getReports.andCallFake(function(module) {
            if (module === REQUISITIONS) {
                return $q.when([report, report2]);
            }
        });

        reportServiceMock.getReportParamsOptions.andCallFake(function(uri) {
            if (uri === FACILITIES_URL) {
                return $q.when({ data: facilityOptions });
            }
            if (uri === PERIODS_URL) {
                return $q.when({ data: periodOptions });
            }
        });
    });

    it('should get a single report', function() {
        var report;

        reportFactory.getReport(REQUISITIONS, REPORT_ID).then(function(data) {
            report = data;
        });
        $rootScope.$apply();

        expect(report).not.toBe(undefined);
        expect(report.id).toEqual(REPORT_ID);
    });

    it('should get reports for a module', function() {
        var reports;

        reportFactory.getReports(REQUISITIONS).then(function(data) {
            reports = data;
        });
        $rootScope.$apply();

        expect(reports).toEqual([report, report2]);
    });

    it('should get all reports', function() {
        var reports;

        reportFactory.getAllReports().then(function(data) {
            reports = data;
        });
        $rootScope.$apply();

        expect(reports).toEqual([report, report2]);
        expect(reportServiceMock.getReports).toHaveBeenCalledWith(REQUISITIONS);
    });

    it('should retrieve report param options', function() {
        var expectedResult = {
            'periods': [
                { name: 'Q1', value: 'Q1'},
                { name: 'Q2', value: 'Q2'},
                { name: 'Q3', value: 'Q3'}
            ],
            'facilities': [
                { name: 'Facility 1', value: 'F01'},
                { name: 'Facility 2', value: 'F02'}
            ]
        },
        paramOptions;

        reportFactory.getReportParamsOptions(report).then(function(data) {
            paramOptions = data;
        });
        $rootScope.$apply();

        expect(paramOptions).toEqual(expectedResult);
    });
});
