/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('Program', function() {

    var rootScope, httpBackend, programFactory, openlmisURL, program1, program2, template, q;

    beforeEach(module('openlmis.administration'));

    beforeEach(module(function($provide){
        var RequisitionTemplateSpy = jasmine.createSpyObj('templateFactory', ['getAll']);

        RequisitionTemplateSpy.getAll.andCallFake(function() {
            return q.when([template]);
        });

    	$provide.factory('templateFactory', function(){
    		return RequisitionTemplateSpy;
    	});
    }));

    beforeEach(inject(function($httpBackend, $rootScope, Program, OpenlmisURL, $q) {
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        programFactory = Program;
        openlmisURL = OpenlmisURL;
        q = $q;

        program1 = {
            id: '1',
            name: 'name1'
        };
        program2 = {
            id: '2',
            name: 'name2'
        };
        template = {
            id: '1',
            programId: '2'
        };
    }));

    it('should get program by id', function() {
        var data;

        httpBackend.when('GET', openlmisURL('/referencedata/api/programs/' + program1.id))
        .respond(200, program1);

        programFactory.get(program1.id).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        rootScope.$apply();

        expect(data.id).toEqual(program1.id);
        expect(data.name).toEqual(program1.name);
    });

    it('should get all programs', function() {
        var data,
            programWithTemplate = angular.copy(program2);

        programWithTemplate.template = template;

        httpBackend.when('GET', openlmisURL('/referencedata/api/programs'))
        .respond(200, [program1, program2]);

        programFactory.getAll().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        rootScope.$apply();

        expect(data[0].id).toEqual(program1.id);
        expect(data[1].id).toEqual(program2.id);
        expect(data[1].template.id).toEqual(template.id);
        expect(data[1].template.programId).toEqual(template.programId);
    });
});
