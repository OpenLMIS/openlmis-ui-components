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

    var $rootScope, $httpBackend, requisitionFactory, q, allStatuses, requisitionUrl, openlmisUrl,
        LineItemSpy, offlineRequitions;

    var TemplateSpy;

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
            supplyingFacility: facility,
            requisitionLineItems: []
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

    beforeEach(module(function($provide){
        var template = jasmine.createSpyObj('template', ['getColumns']),
            TemplateSpy = jasmine.createSpy('Template').andReturn(template);

        template.getColumns.andCallFake(function(nonFullSupply) {
            return nonFullSupply ? nonFullSupplyColumns() : fullSupplyColumns();
        })

        offlineRequitions = jasmine.createSpyObj('offlineRequitions', ['put', 'remove']);

    	$provide.service('Template', function(){
    		return TemplateSpy;
    	});
        $provide.factory('localStorageFactory', function() {
            return function() {
                return offlineRequitions;
            };
        })
    }));

    beforeEach(module(function($provide){
        LineItemSpy = jasmine.createSpy().andCallFake(function(lineItem) {
            return lineItem;
        });

        $provide.service('LineItem', function(){
            return LineItemSpy;
        });
    }));

    beforeEach(inject(function(CategoryFactory) {
        spyOn(CategoryFactory, 'groupFullSupplyLineItems').andReturn(fullSupplyCategories());
        spyOn(CategoryFactory, 'groupNonFullSupplyLineItems').andReturn(nonFullSupplyCategories());
        spyOn(CategoryFactory, 'groupProducts').andReturn([]);
    }));

    beforeEach(inject(function(_$httpBackend_, _$rootScope_, RequisitionFactory, RequisitionURL, OpenlmisURL, Status, $q){
        httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        requisitionFactory = RequisitionFactory;
        requisitionUrl = RequisitionURL;
        openlmisUrl = OpenlmisURL;
        allStatuses = Status;
        q = $q;

        requisitionFactory(requisition, requisitionTemplate, {});
    }));

    it('should submit requisition', function() {
        expect(requisition.$isSubmitted()).toBe(false);

        requisition.status = allStatuses.SUBMITTED;

        httpBackend.when('POST', requisitionUrl('/api/requisitions/' + requisition.id + '/submit'))
        .respond(200, requisition);

        requisition.$submit();

        httpBackend.flush();
        $rootScope.$apply();

        expect(requisition.$isSubmitted()).toBe(true);
    });

    it('should authorize requisition', function() {
        expect(requisition.$isAuthorized()).toBe(false);

        requisition.status = allStatuses.AUTHORIZED;

        httpBackend.when('POST', requisitionUrl('/api/requisitions/' + requisition.id + '/authorize'))
        .respond(200, requisition);

        requisition.$authorize();

        httpBackend.flush();
        $rootScope.$apply();

        expect(requisition.$isAuthorized()).toBe(true);
    });

    it('should approve requisition', function() {
        expect(requisition.$isApproved()).toBe(false);

        requisition.status = allStatuses.APPROVED;

        httpBackend.when('POST', requisitionUrl('/api/requisitions/' + requisition.id + '/approve'))
        .respond(200, requisition);

        requisition.$approve();

        httpBackend.flush();
        $rootScope.$apply();

        expect(requisition.$isApproved()).toBe(true);
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
        ('/api/stockAdjustmentReasons/search?program=' + program.id))
        .respond(200, [stockAdjustmentReason]);

        requisition.$getStockAdjustmentReasons().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson([stockAdjustmentReason]));
    });

    it('should return true if requisition status is initiated', function() {
        requisition.status = allStatuses.INITIATED;

        var isInitiated = requisition.$isInitiated();

        expect(isInitiated).toBe(true);
    });

    it('should return false if requisition status is not initiated', function() {
        requisition.status = allStatuses.SUBMITTED;

        var isInitiated = requisition.$isInitiated();

        expect(isInitiated).toBe(false);
    });

    it('should return true if requisition status is submitted', function() {
        requisition.status = allStatuses.SUBMITTED;

        var isSubmitted = requisition.$isSubmitted();

        expect(isSubmitted).toBe(true);
    });

    it('should return false if requisition status is not submitted', function() {
        requisition.status = allStatuses.INITIATED;

        var isSubmitted = requisition.$isSubmitted();

        expect(isSubmitted).toBe(false);
    });

    it('should return true if requisition status is authorized', function() {
        requisition.status = allStatuses.AUTHORIZED;

        var isAuthorized = requisition.$isAuthorized();

        expect(isAuthorized).toBe(true);
    });

    it('should return false if requisition status is not authorized', function() {
        requisition.status = allStatuses.INITIATED;

        var isAuthorized = requisition.$isAuthorized();

        expect(isAuthorized).toBe(false);
    });

    it('should return true if requisition status is approved', function() {
        requisition.status = allStatuses.APPROVED;

        var isApproved = requisition.$isApproved();

        expect(isApproved).toBe(true);
    });

    it('should return false if requisition status is not approved', function() {
        requisition.status = allStatuses.INITIATED;

        var isApproved = requisition.$isApproved();

        expect(isApproved).toBe(false);
    });

    function fullSupplyCategories() {
        return [
            category('CategoryOne', [lineItemSpy('One'), lineItemSpy('Two')]),
            category('CategoryTwo', [lineItemSpy('Three'), lineItemSpy('Four')])
        ];
    }

    function nonFullSupplyCategories() {
        return [
            category('CategoryThree', [lineItemSpy('Five'), lineItemSpy('Six')]),
            category('CategoryFour', [lineItemSpy('Seven'), lineItemSpy('Eight')])
        ];
    }

    function nonFullSupplyColumns() {
        return [
            column('Three'),
            column('Four')
        ];
    }

    function fullSupplyColumns() {
        return [
            column('One'),
            column('Two')
        ];
    }

    function column(suffix) {
        return {
            name: 'Column' + suffix
        };
    }

    function category(name, lineItems) {
        return {
            name: name,
            lineItems: lineItems
        };
    }

    function lineItemSpy(suffix) {
        var lineItemSpy = jasmine.createSpyObj('lineItem' + suffix, ['areColumnsValid']);
        lineItemSpy.areColumnsValid.andReturn(true);
        return lineItemSpy;
    }
});
