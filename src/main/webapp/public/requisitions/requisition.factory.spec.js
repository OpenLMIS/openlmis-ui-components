/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

describe('RequisitionFactory', function() {

    var $rootScope, $httpBackend, requisitionFactory, q, columnTemplateFactory, allStatuses, requisitionUrl, openlmisUrl;

    var facility = {
            id: '1',
            name: 'facility'
        },
        program = {
            id: '1',
            name: 'program'
        },
        requisition = {
            id: '1',
            name: 'requisition',
            status: 'INITIATED',
            facility: facility,
            program: program,
            supplyingFacility: facility
        },
        stockAdjustmentReason = {
            program: program,
            id: '1'
        },
        columnDefinition = {
            id: '1',
            name: 'begginingBalance',
            label: 'BG',
            sources: ['USER_INPUT'],
            columnType: 'NUMERIC',
            mandatory: true
        },
        begginingBalance = {
            name: 'begginingBalance',
            label: 'BG',
            source: 'USER_INPUT',
            columnDefinition: columnDefinition
        },
        requisitionTemplate = {
            id: '1',
            programId: '1',
            columnsMap : {
                begginingBalance : begginingBalance
            }
        };

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(_$httpBackend_, _$rootScope_, RequisitionFactory, RequisitionURL, OpenlmisURL, ColumnTemplateFactory, Status, $q){
        httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        requisitionFactory = RequisitionFactory;
        requisitionUrl = RequisitionURL;
        openlmisUrl = OpenlmisURL;
        allStatuses = Status.$toList();
        columnTemplateFactory = ColumnTemplateFactory;
        q = $q;

        requisitionFactory(requisition);
    }));

    it('should submit requisition', function() {
        var data;

        httpBackend.when('POST', requisitionUrl('/api/requisitions/' + requisition.id + '/submit'))
        .respond(200, requisition);

        requisition.$submit().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
    });

    it('should authorize requisition', function() {
        var data;

        httpBackend.when('POST', requisitionUrl('/api/requisitions/' + requisition.id + '/authorize'))
        .respond(200, requisition);

        requisition.$authorize().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
    });

    it('should approve requisition', function() {
        var data;

        httpBackend.when('POST', requisitionUrl('/api/requisitions/' + requisition.id + '/approve'))
        .respond(200, requisition);

        requisition.$approve().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
    });

    it('should reject requisition', function() {
        var data;

        httpBackend.when('PUT', requisitionUrl('/api/requisitions/' + requisition.id + '/reject'))
        .respond(200, requisition);

        requisition.$reject().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
    });

    it('should save requisition', function() {
        var data;

        httpBackend.when('PUT', requisitionUrl('/api/requisitions/' + requisition.id))
        .respond(200, requisition);

        requisition.name = 'Saved requisition';

        requisition.$save().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
    });

    it('should get stock adjustment reasons', function() {
        var data;

        httpBackend.when('GET', openlmisUrl
        ('/referencedata/api/stockAdjustmentReasons/search?program=' + program.id))
        .respond(200, [stockAdjustmentReason]);

        requisition.$getStockAdjustmentReasons().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson([stockAdjustmentReason]));
    });

    it('should get column templates', function() {
        var data;

        httpBackend.when('GET', requisitionUrl
        ('/api/requisitionTemplates/search?program=' + program.id))
        .respond(200, requisitionTemplate);

        requisition.$getColumnTemplates().then(function(response) {
            data = response;
        });

        var result = [{
            name:'begginingBalance',
            type: 'NUMERIC',
            source: 'USER_INPUT',
            label: 'BG',
            required: true
        }];

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(result));
    });

    it('should return true if requisition status is initiated', function() {
        var isInitiated = requisition.$isInitiated();

        expect(isInitiated).toBe(true);
    });

    it('should return false if requisition status is not initiated', function() {
        requisition.status = allStatuses[1].label;

        var isInitiated = requisition.$isInitiated();

        expect(isInitiated).toBe(false);
    });

    it('should return true if requisition status is submitted', function() {
        requisition.status = allStatuses[1].label;

        var isSubmitted = requisition.$isSubmitted();

        expect(isSubmitted).toBe(true);
    });

    it('should return false if requisition status is not submitted', function() {
        requisition.status = allStatuses[0].label;

        var isSubmitted = requisition.$isSubmitted();

        expect(isSubmitted).toBe(false);
    });

    it('should return true if requisition status is authorized', function() {
        requisition.status = allStatuses[2].label;

        var isAuthorized = requisition.$isAuthorized();

        expect(isAuthorized).toBe(true);
    });

    it('should return false if requisition status is not authorized', function() {
        requisition.status = allStatuses[0].label;

        var isAuthorized = requisition.$isAuthorized();

        expect(isAuthorized).toBe(false);
    });

    it('should return true if requisition status is approved', function() {
        requisition.status = allStatuses[3].label;

        var isApproved = requisition.$isApproved();

        expect(isApproved).toBe(true);
    });

    it('should return false if requisition status is not approved', function() {
        requisition.status = allStatuses[0].label;

        var isApproved = requisition.$isApproved();

        expect(isApproved).toBe(false);
    });

    it('should return true if requisition is valid', function() {
        var isValid = requisition.$isValid();

        expect(isValid).toBe(true);
    });
});