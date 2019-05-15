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

    beforeEach(function() {
        module('openlmis-config');
        module('openlmis-pagination');
        module('openlmis-repository');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.OpenLMISRepositoryImpl = $injector.get('OpenLMISRepositoryImpl');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.BASE_URL = 'some.url/com';
        this.SOME_ID = 'some-id';
        this.openLMISRepositoryImpl = new this.OpenLMISRepositoryImpl(this.BASE_URL);

        this.page = new this.PageDataBuilder().build();
    });

    describe('constructor', function() {

        //eslint-disable-next-line jasmine/missing-expect
        it('should accept url ending with slash', function() {
            this.$httpBackend
                .expectGET(this.BASE_URL + '/' + this.SOME_ID)
                .respond(200, this.page);

            new this.OpenLMISRepositoryImpl(this.BASE_URL + '/').get(this.SOME_ID);
            this.$httpBackend.flush();
        });

        //eslint-disable-next-line jasmine/missing-expect
        it('should accept url not ending with slash', function() {
            this.$httpBackend
                .expectGET(this.BASE_URL + '/' + this.SOME_ID)
                .respond(200, this.page);

            new this.OpenLMISRepositoryImpl(this.BASE_URL).get(this.SOME_ID);
            this.$httpBackend.flush();
        });

    });

    describe('query', function() {

        it('should return server response on successful request', function() {
            this.$httpBackend
                .expectGET(this.BASE_URL + '?ids=id-one&ids=id-two&page=0&paramOne=valueOne&size=3')
                .respond(200, this.page);

            var result;
            this.openLMISRepositoryImpl.query({
                ids: ['id-one', 'id-two'],
                paramOne: 'valueOne',
                page: '0',
                size: '3'
            })
                .then(function(page) {
                    result = page;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.page));
        });

        it('should accept undefined as argument', function() {
            this.$httpBackend
                .expectGET(this.BASE_URL)
                .respond(200, this.page);

            var result;
            this.openLMISRepositoryImpl.query()
                .then(function(page) {
                    result = page;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.page));
        });

        it('should reject if request was not successful', function() {
            this.$httpBackend
                .expectGET(this.BASE_URL)
                .respond(400);

            var rejected;
            this.openLMISRepositoryImpl.query()
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toBe(true);
        });

    });

    describe('get', function() {

        beforeEach(function() {
            this.response = {
                id: 'some-id',
                some: 'test-object'
            };
        });

        it('should resolve to server response on successful request', function() {
            this.$httpBackend
                .expectGET(this.BASE_URL + '/' + this.response.id)
                .respond(200, this.response);

            var result;
            this.openLMISRepositoryImpl.get(this.response.id)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.response));
        });

        it('should reject on failed request', function() {
            this.$httpBackend
                .expectGET(this.BASE_URL + '/' + this.response.id)
                .respond(400);

            var rejected;
            this.openLMISRepositoryImpl.get(this.response.id)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            this.openLMISRepositoryImpl.get()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingRequest();
        this.$httpBackend.verifyNoOutstandingExpectation();
    });

});
