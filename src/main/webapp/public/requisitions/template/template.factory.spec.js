/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('templateFactory', function() {

    var rootScope, TemplateFactory, template, q;

    beforeEach(module('openlmis.requisitions'));

    beforeEach(module(function($provide){
        var RequisitionTemplateServiceSpy = jasmine.createSpyObj('RequisitionTemplateService', ['get', 'getAll', 'search', 'save']),
            RequisitionColumnSpy =  jasmine.createSpyObj('RequisitionColumn', ['columnDependencies']);

        RequisitionTemplateServiceSpy.get.andCallFake(function() {
            return q.when(template);
        });

        RequisitionTemplateServiceSpy.getAll.andCallFake(function() {
            return q.when([template]);
        });

        RequisitionTemplateServiceSpy.search.andCallFake(function(programId) {
            if(programId === template.programId) {
                return q.when(template);
            }
            return q.when(true);
        });

        RequisitionTemplateServiceSpy.save.andCallFake(function(requisitionTemplate) {
            if(requisitionTemplate.id === template.id && requisitionTemplate.columnsMap.total.displayOrder === 3) {
                return q.when(requisitionTemplate);
            }
            return q.when(true);
        });

        $provide.factory('RequisitionTemplateService', function(){
    		return RequisitionTemplateServiceSpy;
    	});

        RequisitionColumnSpy.columnDependencies.andCallFake(function(column) {
            if(column.name === 'remarks') {
                return ['total'];
            }
            return null;
        });

        $provide.factory('RequisitionColumn', function(){
    		return RequisitionColumnSpy;
    	});
    }));

    beforeEach(inject(function($httpBackend, $rootScope, templateFactory, OpenlmisURL, $q) {
        rootScope = $rootScope;
        TemplateFactory = templateFactory;
        openlmisURL = OpenlmisURL;
        q = $q

        template = {
            id: '1',
            programId: '2',
            columnsMap : {
                total: {
                    isDisplayed: true,
                    displayOrder: 1,
                    name: 'total',
                    label: 'Total',
                    columnDefinition: {
                        canChangeOrder: true,
                        sources: ['USER_INPUT'],
                        isDisplayRequired: false
                    },
                    source: 'USER_INPUT'
                },
                remarks: {
                    isDisplayed: true,
                    displayOrder: 2,
                    name: 'remarks',
                    label: 'Remarks',
                    columnDefinition: {
                        canChangeOrder: true,
                        sources: ['USER_INPUT', 'CALCULATED'],
                        isDisplayRequired: false
                    },
                    source: 'USER_INPUT'
                }
            }
        };
    }));

    it('should get template by id and add required methods', function() {
        var data;

        TemplateFactory.get(template.id).then(function(response) {
            data = response;
        });

        rootScope.$apply();

        expect(data.id).toEqual(template.id);
        expect(angular.isFunction(data.$isValid)).toBe(true);
        expect(angular.isFunction(data.$save)).toBe(true);
        expect(angular.isFunction(data.$moveColumn)).toBe(true);
        angular.forEach(data.columnsMap, function(column) {
            expect(angular.isFunction(data.$isValid)).toBe(true);
        });
    });

    it('should get all templates', function() {
        var data;

        TemplateFactory.getAll().then(function(response) {
            data = response;
        });

        rootScope.$apply();

        expect(data[0].id).toEqual(template.id);
    });

    it('should get template by program id', function() {
        var data;

        TemplateFactory.getByProgram(template.programId).then(function(response) {
            data = response;
        });

        rootScope.$apply();

        expect(data.id).toEqual(template.id);
    });

    it('should save template', function() {
        var data, requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.columnsMap.total.displayOrder = 3;

        requisitionTemplate.$save().then(function(response) {
            data = response;
        });
        rootScope.$apply();

        expect(data.id).toEqual(template.id);
        expect(data.columnsMap.total.displayOrder).toEqual(3);
    });

    it('should check if template is valid when dependent column is not displayed', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.columnsMap.total.isDisplayed = false;

        expect(requisitionTemplate.$isValid()).toBe(false);
    });

    it('should check if template is valid when column is not displayed and columnn source is set to user input and there is more than one source to choose', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.columnsMap.remarks.isDisplayed = false;

        expect(requisitionTemplate.$isValid()).toBe(false);
    });

    it('should check if template is valid when column has empty source', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.columnsMap.total.source = null;

        expect(requisitionTemplate.$isValid()).toBe(false);
    });

    it('should check if template is valid when column and one dependent on it has source set to CALCULATED', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.columnsMap.total.source = 'CALCULATED';
        requisitionTemplate.columnsMap.remarks.source = 'CALCULATED';

        expect(requisitionTemplate.$isValid()).toBe(false);
    });

    it('should move total column below remarks column', function() {
        var requisitionTemplate, columnCopy;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

        columnCopy = angular.copy(requisitionTemplate.columnsMap.total)
        expect(requisitionTemplate.$moveColumn(columnCopy, 2)).toBe(true);

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(1);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(2);
    });

    it('should move remarks column above total column', function() {
        var requisitionTemplate, columnCopy;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

        columnCopy = angular.copy(requisitionTemplate.columnsMap.remarks)
        expect(requisitionTemplate.$moveColumn(columnCopy, 0)).toBe(true);

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(1);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(2);
    });

    it('should not move column if canChangeOrder is set to false', function() {
        var requisitionTemplate, columnCopy;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

        requisitionTemplate.columnsMap.remarks.columnDefinition.canChangeOrder = false;

        columnCopy = angular.copy(requisitionTemplate.columnsMap.remarks)
        expect(requisitionTemplate.$moveColumn(columnCopy, 0)).toBe(false);

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);
    });

    it('should not move column if it is not beetwen the same pinned columns', function() {
        var requisitionTemplate, columnCopy;

        template.columnsMap.begginingBalance = {
            isDisplayed: true,
            displayOrder: 2,
            name: 'beginningBalance',
            label: 'Beginning Balance',
            columnDefinition: {
                canChangeOrder: false,
                sources: ['USER_INPUT', 'CALCULATED'],
                isDisplayRequired: false
            },
            source: 'USER_INPUT'
        }
        template.columnsMap.remarks.displayOrder = 3

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(3);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

        columnCopy = angular.copy(requisitionTemplate.columnsMap.remarks)
        expect(requisitionTemplate.$moveColumn(columnCopy, 0)).toBe(false);

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(3);
        expect(requisitionTemplate.columnsMap.begginingBalance.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);
    });
});
