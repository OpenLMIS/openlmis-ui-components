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

describe('reportService', function() {

    var $rootScope, $httpBackend, reportService, urlFactoryMock,
        report, report2, paramOptions,
        REPORT_ID = '574425e4-0288-11e7-bcbe-3417eb83144e',
        REPORT_ID2 = '84a6b8a2-0289-11e7-a4b0-3417eb83144e',
        REQUISITIONS = 'requisitions',
        SELECT_EXPRESSION = '/api/periods';

    beforeEach(function($provide) {
        module('report', function($provide) {
            urlFactoryMock = jasmine.createSpy();
            $provide.factory('openlmisUrlFactory', function() {
                return urlFactoryMock;
            });
            urlFactoryMock.andCallFake(function(parameter) {
                return parameter;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _reportService_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            reportService = _reportService_;
        });

        report = { id: REPORT_ID };
        report2 = { id: REPORT_ID2 };
        paramOptions = [{name: 'name1', value: 'value1'}, {name: 'name2', value: 'value2'}];
    });

    describe('getReport()', function() {

        beforeEach(function() {
            $httpBackend.when('GET', '/api/reports/templates/requisitions/' + REPORT_ID)
                .respond(200, report);
        });

        it('should return promise', function() {
            var promise = reportService.getReport(REQUISITIONS, REPORT_ID);
            $httpBackend.flush();

            expect(angular.isFunction(promise.then)).toBe(true);
        });

        it('should retrieve single report', function() {
            var data, promise;

            promise = reportService.getReport(REQUISITIONS, REPORT_ID);
            promise.then(function(response) {
                data = response;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).not.toBe(undefined);
            expect(data.id).toBe(REPORT_ID);
        });
    });

    describe('getReports()', function() {

        beforeEach(function() {
           $httpBackend.when('GET', '/api/reports/templates/requisitions')
                .respond(200, [report, report2]);
        });

        it('should return promise', function() {
            var promise = reportService.getReports(REQUISITIONS);
            $httpBackend.flush();

            expect(angular.isFunction(promise.then)).toBe(true);
        });

        it('should retrieve all reports for a module', function() {
            var data, promise;

            promise = reportService.getReports(REQUISITIONS);
            promise.then(function(response) {
                data = response;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).not.toBe(undefined);
            expect(data.length).toEqual(2);
            expect(data[0].id).toBe(REPORT_ID);
            expect(data[1].id).toBe(REPORT_ID2);
        });
    });

    describe('getReportParamsOptions()', function() {

        beforeEach(function() {
            $httpBackend.when('GET', SELECT_EXPRESSION).respond(200, paramOptions);
        });

        it('should return promise', function() {
            var promise = reportService.getReportParamsOptions(SELECT_EXPRESSION);
            $httpBackend.flush();

            expect(angular.isFunction(promise.then)).toBe(true);
        });

        it('should retrieve param options through select expression', function() {
            var data, promise;

            promise = reportService.getReportParamsOptions(SELECT_EXPRESSION);
            promise.then(function(response) {
                data = response.data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).not.toBe(undefined);
            expect(data).toEqual(paramOptions);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
