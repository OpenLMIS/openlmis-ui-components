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

describe('periodService', function() {

    var $rootScope, $httpBackend, requisitionUrlFactoryMock, dateUtilsMock, periodService, periodOne, periodTwo;

    beforeEach(function() {
        module('requisition-initiate', function($provide){
            requisitionUrlFactoryMock = jasmine.createSpy();
            $provide.factory('requisitionUrlFactory', function() {
                return requisitionUrlFactoryMock;
            });
            requisitionUrlFactoryMock.andCallFake(function(parameter) {
                return parameter;
            });

            dateUtilsMock = jasmine.createSpyObj('dateUtils', ['toDate']);
            $provide.factory('dateUtils', function() {
                return dateUtilsMock;
            });
            dateUtilsMock.toDate.andCallFake(function(parameter) {
                return parameter;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _periodService_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            periodService = _periodService_;
        });

        periodOne = {
            id: '1',
            startDate: 'date1',
            endDate: 'date2'
        };
        periodTwo = {
            id: '2',
            startDate: 'date3',
            endDate: 'date4'
        };
    });

    describe('getPeriodsForInitiate', function() {

        var programId = '1',
            facilityId = '2',
            emergency = false,
            data;

        beforeEach(function() {
            $httpBackend.when('GET', requisitionUrlFactoryMock('/api/requisitions/periodsForInitiate?emergency=' + emergency +
                "&facilityId=" + facilityId + "&programId=" + programId)).respond(200, [periodOne, periodTwo]);

            promise = periodService.getPeriodsForInitiate(programId, facilityId, emergency);

            $httpBackend.flush();
        });

        it('should return promise', function() {
            expect(angular.isFunction(promise.then)).toBe(true);
        });

        it('should return proper response', function() {
            var data;

            promise.then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data).not.toBe(undefined);
            expect(data[0].id).toEqual(periodOne.id);
            expect(data[1].id).toEqual(periodTwo.id);
        });

        it('should call date utils', function() {
            expect(dateUtilsMock.toDate).toHaveBeenCalledWith(periodOne.startDate);
            expect(dateUtilsMock.toDate).toHaveBeenCalledWith(periodOne.endDate);
            expect(dateUtilsMock.toDate).toHaveBeenCalledWith(periodTwo.startDate);
            expect(dateUtilsMock.toDate).toHaveBeenCalledWith(periodTwo.endDate);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
