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

describe('requisitionTemplateService', function() {

    var rootScope, httpBackend, requisitionTemplateService, requisitionUrlFactory, template1, template2;

    beforeEach(module('admin-template'));

    beforeEach(inject(function($httpBackend, $rootScope, _requisitionTemplateService_,
                               _requisitionUrlFactory_) {

        httpBackend = $httpBackend;
        rootScope = $rootScope;
        requisitionTemplateService = _requisitionTemplateService_;
        requisitionUrlFactory = _requisitionUrlFactory_;

        template1 = {
            id: '1',
            programId: '1'
        };
        template2 = {
            id: '2',
            programId: '2'
        };
    }));

    it('should get requisition template by id', function() {
        var data;

        httpBackend.when('GET', requisitionUrlFactory('/api/requisitionTemplates/' + template1.id))
        .respond(200, template1);

        requisitionTemplateService.get(template1.id).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        rootScope.$apply();

        expect(data.id).toEqual(template1.id);
        expect(data.programId).toEqual(template1.programId);
    });

    it('should get all requisition templates', function() {
        var data;

        httpBackend.when('GET', requisitionUrlFactory('/api/requisitionTemplates'))
        .respond(200, [template1, template2]);

        requisitionTemplateService.getAll().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        rootScope.$apply();

        expect(data[0].id).toEqual(template1.id);
        expect(data[0].programId).toEqual(template1.programId);
        expect(data[1].id).toEqual(template2.id);
        expect(data[1].programId).toEqual(template2.programId);
    });

    it('should search requisition template by program id', function() {
        var data;

        httpBackend.when('GET', requisitionUrlFactory('/api/requisitionTemplates/search?program=' + template2.programId))
        .respond(200, template2);

        requisitionTemplateService.search(template2.programId).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        rootScope.$apply();

        expect(data.id).toEqual(template2.id);
        expect(data.programId).toEqual(template2.programId);
    });

    it('should saves requisition template', function() {
        var data;

        httpBackend.when('PUT', requisitionUrlFactory('/api/requisitionTemplates/' + template1.id))
        .respond(200, template1);

        requisitionTemplateService.save(template1).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        rootScope.$apply();

        expect(data.id).toEqual(template1.id);
        expect(data.programId).toEqual(template1.programId);
    });
});
