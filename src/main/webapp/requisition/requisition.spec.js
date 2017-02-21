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


describe('Requisition', function() {

    var $rootScope, $httpBackend, q, REQUISITION_STATUS, requisitionUrlFactory, openlmisUrl,
        LineItemSpy, offlineRequitions;

    var TemplateSpy;

    var requisition,
        facility = {
            id: '1',
            name: 'facility'
        },
        program = {
            id: '1',
            name: 'program'
        },
        sourceRequisition = {
            id: '1',
            name: 'requisition',
            status: 'INITIATED',
            facility: facility,
            program: program,
            supplyingFacility: facility,
            requisitionLineItems: [],
            template: {
                id: '1',
                programId: '1',
                columnsMap : {
                begginingBalance : begginingBalance
            }},
            processingPeriod: {
                startDate: new Date(2017, 0, 1),
                endDate: new Date(2017, 0, 31)
            }
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
        };

    beforeEach(module('requisition'));

    beforeEach(module(function($provide){
        var template = jasmine.createSpyObj('template', ['getColumns']),
            TemplateSpy = jasmine.createSpy('RequisitionTemplate').andReturn(template);

        template.getColumns.andCallFake(function(nonFullSupply) {
            return nonFullSupply ? nonFullSupplyColumns() : fullSupplyColumns();
        })

        offlineRequitions = jasmine.createSpyObj('offlineRequitions', ['put', 'remove', 'removeBy']);

    	$provide.service('RequisitionTemplate', function(){
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

    beforeEach(inject(function(_$httpBackend_, _$rootScope_, Requisition, _requisitionUrlFactory_,
                               openlmisUrlFactory, _REQUISITION_STATUS_, $q) {

        httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        requisitionUrlFactory = _requisitionUrlFactory_;
        openlmisUrl = openlmisUrlFactory;
        REQUISITION_STATUS = _REQUISITION_STATUS_;
        q = $q;

        requisition = new Requisition(sourceRequisition, {});
    }));

    it('should submit requisition', function() {
        expect(requisition.$isSubmitted()).toBe(false);

        requisition.status = REQUISITION_STATUS.SUBMITTED;

        httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/submit'))
        .respond(200, requisition);

        requisition.$submit();

        httpBackend.flush();
        $rootScope.$apply();

        expect(requisition.$isSubmitted()).toBe(true);
    });

    it('should authorize requisition', function() {
        expect(requisition.$isAuthorized()).toBe(false);

        requisition.status = REQUISITION_STATUS.AUTHORIZED;

        httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/authorize'))
        .respond(200, requisition);

        requisition.$authorize();

        httpBackend.flush();
        $rootScope.$apply();

        expect(requisition.$isAuthorized()).toBe(true);
    });

    it('should approve requisition', function() {
        expect(requisition.$isApproved()).toBe(false);

        requisition.status = REQUISITION_STATUS.APPROVED;

        httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/approve'))
        .respond(200, requisition);

        requisition.$approve();

        httpBackend.flush();
        $rootScope.$apply();

        expect(requisition.$isApproved()).toBe(true);
    });

    it('should reject requisition', function() {
        var data;

        httpBackend.when('PUT', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/reject'))
        .respond(200, requisition);

        requisition.$reject().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
    });

    it('should skip requisition', function() {
        var data;

        httpBackend.when('PUT', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/skip'))
        .respond(200, requisition);

        requisition.$skip().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
    });

    it('should save requisition', function() {
        var data;

        httpBackend.when('PUT', requisitionUrlFactory('/api/requisitions/' + requisition.id))
        .respond(200, requisition);

        requisition.name = 'Saved requisition';

        requisition.$save().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
    });

    it('should return true if requisition status is initiated', function() {
        requisition.status = REQUISITION_STATUS.INITIATED;

        var isInitiated = requisition.$isInitiated();

        expect(isInitiated).toBe(true);
    });

    it('should return false if requisition status is not initiated', function() {
        requisition.status = REQUISITION_STATUS.SUBMITTED;

        var isInitiated = requisition.$isInitiated();

        expect(isInitiated).toBe(false);
    });

    it('should return true if requisition status is submitted', function() {
        requisition.status = REQUISITION_STATUS.SUBMITTED;

        var isSubmitted = requisition.$isSubmitted();

        expect(isSubmitted).toBe(true);
    });

    it('should return false if requisition status is not submitted', function() {
        requisition.status = REQUISITION_STATUS.INITIATED;

        var isSubmitted = requisition.$isSubmitted();

        expect(isSubmitted).toBe(false);
    });

    it('should return true if requisition status is authorized', function() {
        requisition.status = REQUISITION_STATUS.AUTHORIZED;

        var isAuthorized = requisition.$isAuthorized();

        expect(isAuthorized).toBe(true);
    });

    it('should return false if requisition status is not authorized', function() {
        requisition.status = REQUISITION_STATUS.INITIATED;

        var isAuthorized = requisition.$isAuthorized();

        expect(isAuthorized).toBe(false);
    });

    it('should return true if requisition status is approved', function() {
        requisition.status = REQUISITION_STATUS.APPROVED;

        var isApproved = requisition.$isApproved();

        expect(isApproved).toBe(true);
    });

    it('should return false if requisition status is not approved', function() {
        requisition.status = REQUISITION_STATUS.INITIATED;

        var isApproved = requisition.$isApproved();

        expect(isApproved).toBe(false);
    });

    it('should return true if requisition status is released', function() {
        requisition.status = REQUISITION_STATUS.RELEASED;

        var isReleased = requisition.$isReleased();

        expect(isReleased).toBe(true);
    });

    it('should return false if requisition status is not released', function() {
        requisition.status = REQUISITION_STATUS.INITIATED;

        var isReleased = requisition.$isReleased();

        expect(isReleased).toBe(false);
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
