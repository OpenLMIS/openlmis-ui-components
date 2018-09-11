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

describe('OpenLMISRepositoryImpl', function() {

    var BASE_URL = 'some.url/com';

    var openLMISRepositoryImpl, OpenLMISRepositoryImpl, $httpBackend, $rootScope, PageDataBuilder,
        page;

    beforeEach(function() {
        module('openlmis-config');
        module('openlmis-pagination');
        module('openlmis-repository');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            OpenLMISRepositoryImpl = $injector.get('OpenLMISRepositoryImpl');
            PageDataBuilder = $injector.get('PageDataBuilder');
        });

        openLMISRepositoryImpl = new OpenLMISRepositoryImpl(BASE_URL);

        page = new PageDataBuilder().build();
    });

    describe('constructor', function() {

        var SOME_ID = 'some-id';

        it('should accept url ending with slash', function() {
            $httpBackend
                .expectGET(BASE_URL + '/' + SOME_ID)
                .respond(200, page);

            new OpenLMISRepositoryImpl(BASE_URL + '/').get(SOME_ID);
            $httpBackend.flush();
        });

        it('should accept url not ending with slash', function() {
            $httpBackend
                .expectGET(BASE_URL + '/' + SOME_ID)
                .respond(200, page);

            new OpenLMISRepositoryImpl(BASE_URL).get(SOME_ID);
            $httpBackend.flush();
        });

    });

    describe('query', function() {

        it('should return server response on successful request', function() {
            $httpBackend
                .expectGET(BASE_URL + '?ids=id-one&ids=id-two&page=0&paramOne=valueOne&size=3')
                .respond(200, page);

            var result;
            openLMISRepositoryImpl.query({
                ids: ['id-one', 'id-two'],
                paramOne: 'valueOne',
                page: '0',
                size: '3'
            })
                .then(function(page) {
                    result = page;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(page));
        });

        it('should accept undefine as argument', function() {
            $httpBackend
                .expectGET(BASE_URL)
                .respond(200, page);

            var result;
            openLMISRepositoryImpl.query()
                .then(function(page) {
                    result = page;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(page));
        });

        it('should reject if request was not successful', function() {
            $httpBackend
                .expectGET(BASE_URL)
                .respond(400);

            var rejected;
            openLMISRepositoryImpl.query()
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toBe(true);
        });

    });

    describe('get', function() {

        var response;

        beforeEach(function() {
            response = {
                id: 'some-id',
                some: 'test-object'
            };
        });

        it('should resolve to server response on successful request', function() {
            $httpBackend
                .expectGET(BASE_URL + '/' + response.id)
                .respond(200, response);

            var result;
            openLMISRepositoryImpl.get(response.id)
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(response));
        });

        it('should reject on failed request', function() {
            $httpBackend
                .expectGET(BASE_URL + '/' + response.id)
                .respond(400);

            var rejected;
            openLMISRepositoryImpl.get(response.id)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            openLMISRepositoryImpl.get()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

});
